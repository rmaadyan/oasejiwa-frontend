const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const res = await fetch(`${API_URL}/auth/verify-email?token=${token}`);

    const data = await res.json();

    return Response.json(data, { status: res.status });
}