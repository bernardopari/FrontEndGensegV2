import { z } from "zod";

export const DataSchema = z.object({
  idf: z.number(),
  nmForm: z.string(),
  abre: z.string(),
  estado: z.boolean(), // Valida que sea una fecha ISO 8601
  
});

export const DataArraySchema = z.array(DataSchema);
export type Data = z.infer<typeof DataSchema>;
