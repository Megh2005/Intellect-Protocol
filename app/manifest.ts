import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Intellect Protocol',
        short_name: 'Intellect',
        description: 'The decentralized layer for AI Intellectual Property.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#84cc16', // Electric Lime
        icons: [
            {
                src: 'https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'https://res.cloudinary.com/dlf6jkg3d/image/upload/v1765005966/ic_coin_new_cg1ovb.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
