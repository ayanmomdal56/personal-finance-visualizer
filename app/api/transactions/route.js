import { NextResponse } from "next/server";

// Temporary in-memory storage (use DB like Prisma in real app)
let transactions = [];

export async function POST(req) {
  try {
    const body = await req.json();
    transactions.push(body);
    return NextResponse.json({ message: "Transaction added", transaction: body });
  } catch (err) {
    return NextResponse.json({ error: "Error adding transaction" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ transactions });
}
