// services/api/formulario.service.ts
//import { Data } from "@/types";
import { z } from "zod";
import { DataSchema, Data } from "@/app/intranet/inicio/sub-configuracion/formulario/data/schema"; // Asegúrate de importar tus esquemas de validación
import { getToken } from "./getToken.service"; // Importar la función para obtener el token

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

  
export const fetchFormularios = async (): Promise<Data[]> => {
  const token = await getToken();
  //console.log("Token obtenido:", token); // Depuración

  if (!token) {
    throw new Error("Token no proporcionado");
  }

  const response = await fetch(`${API_URL}/api/form`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  //console.log("Respuesta de la API:", response); // Depuración

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al cargar los datos.");
  }

  const data = await response.json();
  //console.log("Datos obtenidos:", data); // Depuración

  const parsedData = z.array(DataSchema).parse(data);
  return parsedData;
};

export const actualizarEstadoEnAPI = async (idf: number, estado: boolean) => {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/form/toggle/${idf}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) throw new Error('Error en la actualización');
    
    return await response.json();
  } catch (error) {
    throw new Error('Error al actualizar el estado');
  }
};

