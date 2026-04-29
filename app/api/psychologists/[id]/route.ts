import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const res = await fetch(`${API_URL}/psychologists/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}