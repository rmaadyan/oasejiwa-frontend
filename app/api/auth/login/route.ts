const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id"; 

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login gagal");
        }

        return Response.json(data);
    } catch (error: any) {
        return Response.json(
            { message: error.message || "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}