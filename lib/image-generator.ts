import axios from "axios";
import FormData from "form-data";

export async function generateImage(prompt: string): Promise<Buffer> {
    try {
        const payload = {
            prompt: prompt,
            output_format: "png",
        };

        const response = await axios.postForm(
            `https://api.stability.ai/v2beta/stable-image/generate/core`,
            axios.toFormData(payload, new FormData()),
            {
                validateStatus: undefined,
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
                    Accept: "image/*",
                },
            }
        );

        if (response.status === 200) {
            return Buffer.from(response.data);
        } else {
            throw new Error(`Stability AI API error: ${response.status} ${response.statusText} - ${response.data.toString()}`);
        }
    } catch (error) {
        console.error('Error generating image with Stability AI:', error);
        throw error;
    }
}