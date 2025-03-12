//\intranet\inicio\sub-configuracion\formulario\components\column.tsx 
"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Data } from "../data/schema";
import { DataTableColumnHeader } from "../components/data-table-column-header";
import { DataTableRowActions } from "../components/data-table-row-actions";
import { useState } from "react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formatear en español
import { toast,Toaster } from "sonner" // Importa la función toast de sonner
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "idf",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id"/>
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("idf")}</div>,
    enableSorting: true,
    enableHiding: true,
    meta: { label: "id" },
  },
  {
    accessorKey: "nmForm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("nmForm")}
          </span>
        </div>
      )
    },
    meta: { label: "nombre" },
  },
  {
    accessorKey: "abre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Abreviatura" />
    ),
    cell: ({ row }) => {
      
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("abre")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row, table }) => {
      const [isUpdating, setIsUpdating] = useState(false);
      const estado = row.getValue<boolean>("estado"); // Obtén el valor booleano de "estado"
      //console.log(table.options.data, "table");

      const handleChange = async () => {
        if (isUpdating) return;
        
        const nuevoEstado = !estado;
        const estadoAnterior = estado;
        setIsUpdating(true);
        //row.toggleSelected(nuevoEstado);
        try {
          // @ts-ignore - La función viene del componente padre
          if (table.options.meta?.onEstadoChange) {
            // @ts-ignore
            await table.options.meta.onEstadoChange(
              row.original.idf,
              nuevoEstado
            );
          }
          toast.success("Estado actualizado correctamente", {
            description: `${row.getValue<string>("nmForm")} ahora está ${
              nuevoEstado ? "activo" : "inactivo"
            }`,
          });
        } catch(error) {
          // 4. Revertir cambios en caso de error
          //row.toggleSelected(estadoAnterior); // Rollback visual
          toast.error("Error al actualizar el estado", {
            description: "El estado se ha revertido al valor anterior.",
          });
        } finally {

          setIsUpdating(false);
        }
      };

      return (
        <div className="flex items-center">
      <Toaster position="bottom-right" />

          <Input
            type="radio"
            name={`estado-${row.id}`}
            checked={estado}
            onChange={handleChange}
            className={`form-radio h-4 w-4`}
            onClick={() => {
              // Usa la función toast de sonner
              toast("Formulario actualizado correctamente", {
                description: `${row.getValue<string>("nmForm")} ahora está ${estado ? "inactivo" : "activo"}`,
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo clicked"),
                },
              })
            }}
          />
      </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: { label: "Estado" },
  },
  // ================= columnas por default =================
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string

      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es }); // Formatea la fecha
      return (
        <div className="flex items-center">
          
          <span>{fechaFormateada}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: { label: "Fecha de creacion" }, // Usar meta para agregar label
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de actualización" />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue<string>("updatedAt"); // Especifica el tipo como string
      
      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es });
      
      return (
        <div className="flex items-center">
          
          <span>{fechaFormateada}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: { label: "Fecha de actualización" }, // Usar meta para agregar label
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
