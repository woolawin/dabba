export async function POST({ request }) {
    const data = await request.json();

    const outpayload = {
        original: data.original,
        selected: data.selected,
        translation: "foobar",
    };

    return new Response(JSON.stringify(outpayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
