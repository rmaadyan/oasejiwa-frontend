import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.headers.get("authorization");

    const res = await fetch("http://localhost:3001/admin/psychologists", {
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

    const res = await fetch("http://localhost:3001/admin/psychologists", {
        method: "POST",
        headers: {
            Authorization: token || "",
        },
        body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}