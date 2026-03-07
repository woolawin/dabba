import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";

export async function POST({ request }) {
    const data = await request.json();

    const client = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });

    const response = await client.responses.create({
        model: "gpt-5",
        input: [
            { role: "user", content: "From the following Swedish text" },
            { role: "user", content: data.original },
            { role: "user", content: "translate the following into english " },
            { role: "user", content: data.selected },
        ],
    });

    const outpayload = {
        original: data.original,
        selected: data.selected,
        translation: response.output_text,
    };

    return new Response(JSON.stringify(outpayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
