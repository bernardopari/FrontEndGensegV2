"use client";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect} from "react";
import Link from "next/link";
import { DataTable } from "./components/data-table";
import { columns } from "./components/column";
import { Data} from './data/schema';
import { fetchFormularios, actualizarEstadoEnAPI } from '@/services/api/formulario.service';
import SkeletonTable from "@/components/skeletonTable";
import { Separator } from "@radix-ui/react-separator";

export function AlertDialogDemo() {
  const [nombre, setNombre] = useState("");
  const [isFocusedNombre, setIsFocusedNombre] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError(true);
      return; // Mostrar error pero no cerrar el diálogo
    }

    // Si está todo válido
    setIsOpen(false);
    setError(false);
    console.log("Formulario guardado", nombre);
    // Lógica para guardar el formulario...
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          Agregar formulario
          <PlusCircle />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl text-center">
            Agregar formulario
          </AlertDialogTitle>
          <AlertDialogDescription>
            En esta sección podrás agregar un formulario para que los usuarios
            puedan completar al subir un proyecto.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Label className="text-lg">Información del formulario</Label>

        <div className="relative mt-4">
          <Label
            htmlFor="nombre-formulario"
            className={`absolute left-3 transition-all duration-200 cursor-text ${
              nombre || isFocusedNombre
                ? "top-[-10px] text-sm bg-background px-1 text-primary"
                : "top-3 text-muted-foreground"
            } ${error ? "text-red-500" : ""}`}
          >
            Nombre del formulario <span className="text-red-600">*</span>
          </Label>
          <Input
            id="nombre-formulario"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (error) setError(false); // Quitar error al escribir
            }}
            onFocus={() => setIsFocusedNombre(true)}
            onBlur={() => setIsFocusedNombre(false)}
            className={`pt-4 ${error ? "border-red-500" : ""}`}
            placeholder={
              isFocusedNombre ? "Escriba aqui el nombre del formulario" : ""
            }
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">
              ¡Ups! El nombre es obligatorio
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-red-600 text-white hover:bg-red-800 hover:text-white"
            onClick={() => setError(false)}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-600 hover:bg-green-800"
            onClick={handleContinue}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function formulario() {
  const [formularios, setFormularios] = useState<Data[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadFormularios = async () => {
      try {
        const data = await fetchFormularios();
        setFormularios(data);

      } catch (err) {
        console.error("Error al cargar los datos:", err); // Depuración
        setError("Hubo un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    loadFormularios();
  }, []);

// Función para actualización optimista
const updateEstadoOptimista = async (idf: number, nuevoEstado: boolean) => {
  // Guardar estado anterior
  const estadoAnterior = formularios?.find(f => f.idf === idf)?.estado;
  const formularioActivo = formularios?.find(form => form.estado === true);

  // Actualización optimista local
  setFormularios(prev => prev ? prev.map(form => 
    form.idf === idf ? {...form, estado: nuevoEstado} : form
  ) : null);
  setFormularios(prev => prev ? prev.map(form => 
    form.idf === formularioActivo?.idf ? { ...form, estado: false } : form
  ) : null);
  try {
    // Llamar a tu API
    const response = await actualizarEstadoEnAPI(idf, nuevoEstado);
    if(!response)
    {
      setFormularios(prev => prev ? prev.map(form => 
        form.idf === idf ? {...form, estado: estadoAnterior ?? form.estado} : form
      ) : null);
      
    }
    else{
      setFormularios(prev => prev ? prev.map(form => 
        form.idf === formularioActivo?.idf ? { ...form, estado: false } : form
      ) : null);
        
    }
  } catch (error) {
    // Revertir en caso de error
    setFormularios(prev => prev ? prev.map(form => 
      form.idf === idf ? {...form, estado: estadoAnterior ?? form.estado} : form
    ) : null);
    
    // Mostrar error al usuario
    console.log('Error al actualizar el estado');
  }
}

  
  return (
    <div className="mx-auto p-4 text-black dark:text-white space-y-4">
      <Label className="text-2xl font-bold dark:text-slate-200">
        Formularios
      </Label>
      {/*<AlertDialogDemo />*/}
      <Separator orientation="horizontal" className="w-full" />
      <Button
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 w-auto"
        asChild
      >
        <Link
          href="/intranet/inicio/sub-configuracion/formulario/nuevo-formulario"
          className=""
        >
          Agregar formulario
          <PlusCircle />
        </Link>
      </Button>

      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-left">
              Formularios de esta sub unidad
            </h2>
            <p className="text-muted-foreground">
              Lista de todos los formularios configurados para esta sub unidad.
            </p>
          </div>
        </div>
        { loading ? <SkeletonTable /> :
          <DataTable data={formularios || []} columns={columns} onEstadoChange={updateEstadoOptimista}/>
        }
        
      </div>
    </div>
  );
}
