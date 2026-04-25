export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch("http://localhost:3001/auth/resend-verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Gagal resend email");
        }

        return Response.json(data);
    } catch (error: any) {
        return Response.json(
            { message: error.message || "Terjadi kesalahan" },
            { status: 500 }
        );
    }
}