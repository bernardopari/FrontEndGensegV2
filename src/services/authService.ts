import { Usuario, Rol } from '../models/types/usuario.type'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}` || "http://localhost:3006";


interface RoleSelectionData {
  email: string;
  dni: string;
  rol_id: number;
  subunidad_id_subuni: number;
}

interface LoginResponse {
  token: string;
  users: Usuario[];
  message: string;
  error?: string;
  admin: boolean;
}

export const loginUser = async ({email, password}: {email:string, password:string}): Promise<LoginResponse> => {
  const data = { email, password };
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Usuario no encontrado.");
  }

  return response.json();
};

export const selectRole = async (data: RoleSelectionData): Promise<LoginResponse> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al seleccionar el rol.");
  }

  return response.json();
};