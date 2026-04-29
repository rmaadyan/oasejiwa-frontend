import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = req.headers.get("authorization");

    const res = await fetch(`${API_URL}/admin/psychologists/${id}`, {
        headers: { Authorization: token || "" },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = req.headers.get("authorization");
    const formData = await req.formData();

    const res = await fetch(`${API_URL}/admin/psychologists/${id}`, {
        method: "PATCH",
        headers: { Authorization: token || "" },
        body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = req.headers.get("authorization");

    const res = await fetch(`${API_URL}/admin/psychologists/${id}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}