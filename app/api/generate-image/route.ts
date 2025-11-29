import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/image-generator';
import sharp from 'sharp';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: NextRequest) {
    try {
        const { prompt, walletAddress, email } = await request.json();

        if (!prompt || !walletAddress) {
            return NextResponse.json(
                { error: 'Prompt and wallet address are required' },
                { status: 400 }
            );
        }

        // Check usage limits
        const generationsRef = collection(db, 'image_generations');
        const uniqueIds = new Set<string>();

        // Check by wallet address
        const qWallet = query(generationsRef, where('walletAddress', '==', walletAddress));
        const snapshotWallet = await getDocs(qWallet);
        snapshotWallet.forEach(doc => uniqueIds.add(doc.id));

        // Check by email if provided
        if (email) {
            const qEmail = query(generationsRef, where('email', '==', email));
            const snapshotEmail = await getDocs(qEmail);
            snapshotEmail.forEach(doc => uniqueIds.add(doc.id));
        }

        if (uniqueIds.size >= 2) {
            return NextResponse.json(
                { error: 'Limit reached. You can only generate 2 images.' },
                { status: 403 }
            );
        }

        // Generate image with Gemini
        const imageBuffer = await generateImage(prompt);

        // Resize to square dimensions (512x512) for NFT standards
        const squareBuffer = await sharp(imageBuffer)
            .resize(512, 512, { fit: 'cover', position: 'center' })
            .png({ quality: 90 })
            .toBuffer();

        // Record usage
        await addDoc(collection(db, 'image_generations'), {
            walletAddress,
            email: email || null,
            prompt,
            timestamp: new Date().toISOString()
        });

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