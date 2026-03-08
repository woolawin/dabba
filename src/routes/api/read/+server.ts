import vision from "@google-cloud/vision";

import { GOOGLE_SA_EMAIL, GOOGLE_SA_KEY } from "$env/static/private";

export async function POST({ request }) {
    const data = await request.json();

    const client = new vision.ImageAnnotatorClient({
        credentials: {
            client_email: GOOGLE_SA_EMAIL,
            private_key: GOOGLE_SA_KEY.replace(/\\n/g, "\n"),
        },
    });

    const base64Image = data.image.replace(/^data:image\/\w+;base64,/, "");

    const [result] = await client.documentTextDetection({
        image: { content: base64Image },
    });

    const outpayload = {
        text: result.fullTextAnnotation?.text || "",
    };

    return new Response(JSON.stringify(outpayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
