import { NextRequest, NextResponse } from 'next/server';
import { getServerStoryClient } from '@/lib/story-protocol';
import { uploadToIPFS } from '@/lib/pinata';
import { DisputeTargetTag } from '@story-protocol/core-sdk';
import { parseEther } from 'viem';

export async function POST(request: NextRequest) {
    try {
        if (!process.env.WALLET_PRIVATE_KEY) throw new Error('WALLET_PRIVATE_KEY is missing');
        if (!process.env.NEXT_PUBLIC_PINATA_JWT) throw new Error('NEXT_PUBLIC_PINATA_JWT is missing');
        if (!process.env.NEXT_PUBLIC_PINATA_GATEWAY) throw new Error('NEXT_PUBLIC_PINATA_GATEWAY is missing');

        const {
            targetIpId,
            targetTag,
            evidence,
            walletAddress
        } = await request.json();

        if (!targetIpId || !targetTag || !evidence || !walletAddress) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Upload evidence to IPFS
        const evidenceData = {
            title: "Dispute Evidence",
            description: evidence,
            createdAt: new Date().toISOString(),
            targetIpId,
            targetTag,
            liveness: 2592000, // 30 days
            bond: "0.1 IP",
            counterEvidence: "Pending", // Placeholder for future counter evidence
            appealed: "No" // Initial state
        };

        const evidenceCid = await uploadToIPFS(evidenceData, `dispute_evidence_${targetIpId}.json`);

        const storyClient = await getServerStoryClient();

        const response = await storyClient.dispute.raiseDispute({
            targetIpId: targetIpId as `0x${string}`,
            cid: evidenceCid,
            targetTag: targetTag as DisputeTargetTag,
            bond: parseEther("0.1"), // 0.1 IP/ETH bond
            liveness: 2592000, // 30 days in seconds
        });

        return NextResponse.json({
            success: true,
            txHash: response.txHash,
            disputeId: response.disputeId ? response.disputeId.toString() : undefined,
            evidenceCid
        });

    } catch (error: any) {
        console.error('Error raising dispute:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to raise dispute' },
            { status: 500 }
        );
    }
}
