import { createWorker } from "tesseract.js";

export async function POST({ request }) {
    const data = await request.json();

    const worker = await createWorker("swe", 1, {
        logger: (m) => console.log(m),
    });

    const outpayload = {
        text: "",
    };

    const {
        data: { text },
    } = await worker.recognize(data.image);
    outpayload.text = text;
    await worker.terminate();

    return new Response(JSON.stringify(outpayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
