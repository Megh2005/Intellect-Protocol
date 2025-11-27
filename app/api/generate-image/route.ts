import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/image-generator';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
    try {
        const { prompt, walletAddress } = await request.json();

        if (!prompt || !walletAddress) {
            return NextResponse.json(
                { error: 'Prompt and wallet address are required' },
                { status: 400 }
            );
        }

        // Generate image with Gemini
        const imageBuffer = await generateImage(prompt);

        // Resize to square dimensions (512x512) for NFT standards
        const squareBuffer = await sharp(imageBuffer)
            .resize(512, 512, { fit: 'cover', position: 'center' })
            .png({ quality: 90 })
            .toBuffer();

        return NextResponse.json({
            success: true,
            imageBuffer: squareBuffer.toString('base64')
        });
    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}