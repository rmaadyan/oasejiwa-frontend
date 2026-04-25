export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const res = await fetch(`http://localhost:3001/auth/verify-email?token=${token}`);

    const data = await res.json();

    return Response.json(data, { status: res.status });
}