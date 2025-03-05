import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (!token) {
    return NextResponse.json({ error: "Token no proporcionado" }, { status: 401 });
  }
  return NextResponse.json({ token });
}