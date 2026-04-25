import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = req.headers.get("authorization");

    const res = await fetch(`http://localhost:3001/admin/psychologists/${id}`, {
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

    const res = await fetch(`http://localhost:3001/admin/psychologists/${id}`, {
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

    const res = await fetch(`http://localhost:3001/admin/psychologists/${id}`, {
        method: "DELETE",
        headers: { Authorization: token || "" },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}