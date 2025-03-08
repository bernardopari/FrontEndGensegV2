"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { estados } from "../data/data"
import { Data } from "../data/schema"
import { DataTableColumnHeader } from "../components/data-table-column-header"
import { DataTableRowActions } from "../components/data-table-row-actions"

import { format } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formatear en español

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
    cell: ({ row }) => {
      const estado = row.getValue<boolean>("estado"); // Obtén el valor booleano de "estado"
  
      return (
        <div className="flex items-center space-x-2">
          {/* RadioButton para "Activo" (true) */}
          <label className="flex items-center space-x-2">
            <Input
              type="radio"
              name={`estado-${row.id}`} // Usa un nombre único para cada fila
              checked={estado}
              onChange={() => {}} // Aquí puedes agregar la lógica para actualizar el estado
              className="form-radio h-4 w-4 text-blue-600"
            />
          </label>
  
          
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
      if (!fecha || isNaN(new Date(fecha).getTime())) {
        return <div className="flex items-center">Fecha inválida</div>;
      }

      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es });
      return (
        <div className="flex items-center">
          
          <span>{row.getValue<string>("createdAt")}</span>
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
      const fecha = row.getValue<string>("createdAt"); // Especifica el tipo como string
      if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(fecha)) {
        return "Fecha inválida";
      }
      const fechaFormateada = format(new Date(fecha), "dd/MM/yyyy", { locale: es });
      
      return (
        <div className="flex items-center">
          
          <span>{row.getValue<string>("createdAt")}</span>
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
