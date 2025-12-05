import { NextRequest, NextResponse } from 'next/server';
import { getServerStoryClient, WIP_TOKEN_ADDRESS, ROYALTY_POLICY_LAP } from '@/lib/story-protocol';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        const { ipId, walletAddress } = await request.json();

        if (!ipId || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const storyClient = await getServerStoryClient();

        // Find child IPs to claim from (Scenario #2)
        // In a production app, you would have a more efficient way to query this (e.g., a dedicated 'relationships' collection)
        // Here we scan all users' registered IPs to find children of this IP.
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const childIpIds: string[] = [];

        usersSnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.registeredIps && Array.isArray(userData.registeredIps)) {
                userData.registeredIps.forEach((ip: any) => {
                    if (ip.parentIpId === ipId) {
                        childIpIds.push(ip.ipId);
                    }
                });
            }
        });

        console.log(`Found ${childIpIds.length} child IPs for ${ipId}:`, childIpIds);

        // Claim Revenue
        // We claim from both direct and child sources
        let claimRevenue;
        try {
            claimRevenue = await storyClient.royalty.claimAllRevenue({
                ancestorIpId: ipId as `0x${string}`,
                claimer: ipId as `0x${string}`, // The IP Account itself owns the revenue rights usually
                currencyTokens: [WIP_TOKEN_ADDRESS],
                childIpIds: childIpIds as `0x${string}`[],
                royaltyPolicies: [ROYALTY_POLICY_LAP],
                claimOptions: {
                    autoTransferAllClaimedTokensFromIp: true,
                    autoUnwrapIpTokens: true,
                },
            });

            console.log(`Claimed revenue for ${ipId}:`, claimRevenue.claimedTokens);

            // Convert BigInt values to strings for JSON serialization
            // Use JSON.stringify replacer to handle BigInts in any structure (Array or Object)
            const claimedTokens = JSON.parse(JSON.stringify(
                claimRevenue.claimedTokens,
                (key, value) => typeof value === 'bigint' ? value.toString() : value
            ));

            return NextResponse.json({
                success: true,
                claimedTokens: claimedTokens,
                txHashes: claimRevenue.txHashes
            });

        } catch (claimError: any) {
            console.error('Claim execution error:', claimError);
            // Handle "No revenue to claim" revert (0x03696e76 or generic revert)
            if (claimError.message?.includes('0x03696e76') || claimError.message?.includes('reverted')) {
                return NextResponse.json({
                    success: false,
                    error: "No revenue available to claim."
                });
            }
            throw claimError; // Re-throw unexpected errors
        }

    } catch (error: any) {
        console.error('Error claiming revenue:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to claim revenue' },
            { status: 500 }
        );
    }
}
