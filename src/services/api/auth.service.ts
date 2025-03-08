// services/api/auth.service.ts
import { LoginResponse, User } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al iniciar sesión");
  }

  return response.json();
};

export const loginUnique = async (user: User): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login/unique`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      iddatausuario: user.iddatauser,
      idrol: user.roles.id_rol,
      idsubunidad: user.subunidad.id_subuni,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al seleccionar el rol");
  }

  return response.json();
};