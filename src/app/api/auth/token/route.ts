import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// api/auth/token/route.ts
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificación básica del token
    //const isValid = await verifyToken(token); // Implementar esta función
    /*if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }*/

    // Devolver solo un indicador de validez, no el token
    return new Response(JSON.stringify({ valid: true , token:token}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Token API error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}