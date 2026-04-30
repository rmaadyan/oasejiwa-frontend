import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oasejiwa.id";

export async function GET(req: NextRequest) {
    const token = req.headers.get("authorization");

    const res = await fetch(`${API_URL}/admin/psychologists`, {
        headers: {
            Authorization: token || "",
        },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization");
    const formData = await req.formData();

    const res = await fetch(`${API_URL}/admin/psychologists`, {
        method: "POST",
        headers: {
            Authorization: token || "",
        },
        body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}