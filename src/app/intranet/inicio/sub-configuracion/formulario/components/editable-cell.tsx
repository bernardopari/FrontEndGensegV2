// components/editable-cell.tsx
"use client"

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { actualizarEstadoEnAPI } from '@/services/api/formulario.service'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-hot-toast'
import { Data } from '../data/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const cellSchema = z.object({
  nmForm: z.string().min(3, 'Mínimo 3 caracteres'),
  abre: z.string().max(6, 'Máximo 6 caracteres'),
  estado: z.boolean()
})

export function EditableCell<TData extends Data>({
  row,
  columnId,
  value: initialValue
}: {
  row: { original: TData }
  columnId: keyof TData
  value: any
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(cellSchema),
    defaultValues: { [columnId]: initialValue }
  })

  const mutation = useMutation({
    mutationFn: async (newValue: any) => {
      const validated = cellSchema.parse({ [columnId]: newValue })
      console.log('validated', validated);
      //return actualizarEstadoEnAPI(row.original.idf, validated.estado);
    },
    onMutate: async (newValue) => {
      await queryClient.cancelQueries({ queryKey: ['formularios'] })
      
      const previousData = queryClient.getQueryData<Data[]>(['formularios'])
      queryClient.setQueryData(['formularios'], (old: Data[] | undefined) => 
        old?.map(item => 
          item.idf === row.original.idf ? { ...item, [columnId]: newValue } : item
        ) || []
      )
      
      return { previousData }
    },
    onError: (err, newValue, context) => {
      queryClient.setQueryData(['formularios'], context?.previousData)
      toast.error(`Error al actualizar: ${err.message}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['formularios'] })
    }
  })

  const handleBlur = () => {
    setIsEditing(false)
    if (columnId === 'estado') return // El Switch no necesita submit
    
    handleSubmit((data) => {
      mutation.mutate(data[columnId as keyof typeof cellSchema.shape])
    })()
  }

  if (columnId === 'estado') {
    return (
      <div className="flex items-center">
        <Switch
          checked={initialValue}
          onCheckedChange={(val) => mutation.mutate(val)}
          disabled={mutation.isPending}
        />
        {mutation.isPending && (
          <span className="ml-2 text-sm text-muted-foreground">Guardando...</span>
        )}
      </div>
    )
  }

  return isEditing ? (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data[columnId as keyof typeof cellSchema.shape]))}>
      <Input
        {...register(columnId as "nmForm" | "abre" | "estado")}
        autoFocus
        onBlur={handleBlur}
        className="w-full h-8"
      />
      {errors[columnId as keyof typeof cellSchema.shape] && (
        <span className="text-red-500 text-xs">
          {errors[columnId as keyof typeof cellSchema.shape]?.message?.toString()}
        </span>
      )}
    </form>
  ) : (
    <div
      className="p-2 cursor-pointer hover:bg-accent rounded"
      onClick={() => setIsEditing(true)}
    >
      {initialValue}
    </div>
  )
}