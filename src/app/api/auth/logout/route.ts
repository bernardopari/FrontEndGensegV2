import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Crear una respuesta
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 }
  );

  // Borrar la cookie 'auth-token'
  response.cookies.delete("auth-token");

  return response;
}