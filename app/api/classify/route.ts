// app/api/classify/route.ts
export async function POST(req: Request) {
  const { description } = await req.json();
  const res = await fetch("http://localhost:3001/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  return new Response(JSON.stringify(await res.json()));
}
