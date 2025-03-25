// services/api/formulario.service.ts
//import { Data } from "@/types";
import { z } from "zod";
import { DataSchema, Data } from "@/app/intranet/inicio/sub-configuracion/formulario/data/schema"; // Asegúrate de importar tus esquemas de validación
import { getToken } from "./getToken.service"; // Importar la función para obtener el token
import { toast } from "sonner"; // Importa la función toast de sonner
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

export const guardarFormulario = async (nombre: string, preguntas: any[]): Promise<void> => {
  if (!nombre.trim()) {
    toast.error("El nombre del formulario no puede estar vacío."); // Notificación de error
    throw new Error("El nombre del formulario no puede estar vacío.");
  }

  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/api/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ preguntas, name: nombre }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error || "Error al guardar el formulario."); // Notificación de error
      throw new Error(errorData.error || "Error al guardar el formulario.");
    }

    toast.success("Formulario guardado exitosamente"); // Notificación de éxito
  } catch (error) {
    toast.error("Error al guardar el formulario."); // Notificación de error
    throw error;
  }
};


export const obtenerFormularioPorId = async (id: string | number): Promise<any> => {
  const token = await getToken();
  
  try {
    const response = await fetch(`${API_URL}/api/form/preguntas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error || "Error al obtener el formulario.");
      throw new Error(errorData.error || "Error al obtener el formulario.");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    toast.error("Error al cargar el formulario.");
    throw error;
  }
};

export const actualizarFormulario = async (id: string | number, formData: { name: string; preguntas: any[] }): Promise<void> => {
  if (!formData.name.trim()) {
    toast.error("El nombre del formulario no puede estar vacío.");
    throw new Error("El nombre del formulario no puede estar vacío.");
  }

  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/api/form/preguntas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error || "Error al actualizar el formulario.");
      throw new Error(errorData.error || "Error al actualizar el formulario.");
    }

    toast.success("Formulario actualizado exitosamente");
    
  } catch (error) {
    toast.error("Error al actualizar el formulario.");
    throw error;
  }
};