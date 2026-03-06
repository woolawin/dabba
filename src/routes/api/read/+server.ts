export async function POST({ request }) {
    const data = await request.json();

    const outpayload = {
        text: "The quick brown fox jumped over the lazy dog",
    };

    return new Response(JSON.stringify(outpayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
