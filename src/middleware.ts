import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Obtén la cookie que contiene el token
  const token = request.cookies.get("auth-token")?.value; // "auth-token" es el nombre de la cookie

  // Verifica si la ruta es /intranet/
  if (url.pathname.startsWith("/intranet/")) {
    if (!token) {
      // Si no hay token en la cookie, redirige a la página de inicio de sesión
      return NextResponse.redirect(new URL("/intranet", request.url));
    }

    try {
      // Verifica la autenticación con el servidor
      const session = await fetch("http://localhost:3006/api/auth/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!session.ok) {
        // Si la autenticación falla, redirige a la página de inicio de sesión
        return NextResponse.redirect(new URL("/intranet", request.url));
      }

      // Si todo está bien, permite que la solicitud continúe
      return NextResponse.next();
    } catch (error) {
      console.error(error);
      // Si hay un error, redirige a la página de inicio de sesión
      return NextResponse.redirect(new URL("/intranet", request.url));
    }
  }

  // Si la ruta no es /intranet/, permite que la solicitud continúe
  return NextResponse.next();
}