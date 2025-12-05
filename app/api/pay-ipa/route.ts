import { NextRequest, NextResponse } from 'next/server';
import { getServerStoryClient, WIP_TOKEN_ADDRESS } from '@/lib/story-protocol';
import { parseEther, zeroAddress } from 'viem';

export async function POST(request: NextRequest) {
    try {
        const { receiverIpId, amount, payerIpId } = await request.json();

        if (!receiverIpId || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields: receiverIpId, amount' },
                { status: 400 }
            );
        }

        const storyClient = await getServerStoryClient();

        // Scenario #1: Tipping an IP Asset (payerIpId is zeroAddress)
        // Scenario #2: Paying Due Share (payerIpId is the child IP)
        // We default to zeroAddress if not provided, for tipping.
        const payer = payerIpId || zeroAddress;

        const payRoyalty = await storyClient.royalty.payRoyaltyOnBehalf({
            receiverIpId: receiverIpId as `0x${string}`,
            payerIpId: payer as `0x${string}`,
            token: WIP_TOKEN_ADDRESS,
            amount: parseEther(amount.toString()),
        });

        console.log(`Paid royalty to ${receiverIpId} at tx ${payRoyalty.txHash}`);

        return NextResponse.json({
            success: true,
            txHash: payRoyalty.txHash
        });

    } catch (error: any) {
        console.error('Error paying IPA:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to pay IPA' },
            { status: 500 }
        );
    }
}
