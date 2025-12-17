import { z } from "zod";

export const officeSchema = z.object({
  id: z.number(),
  office_code: z.string(),
  parent_office_code: z.string().nullable(),
  parent_office_name: z.string().nullable(),
  name: z.string(),
  address: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  radius_meters: z.number(),
  sort_order: z.number(),
  description: z.string().nullable(),
});

export const officeDetailSchema = officeSchema.extend({
  parent_office_name: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const officeFormSchema = z.object({
  parent_office_code: z.string().nullable().optional(),
  name: z
    .string()
    .min(3, "Nama kantor harus minimal 3 karakter")
    .nonempty("Nama kantor wajib diisi"),
  address: z.string().nonempty("Alamat kantor wajib diisi"),
  latitude: z.coerce
    .number()
    .min(-90, "Latitude minimal -90 derajat")
    .max(90, "Latitude maksimal 90 derajat"),
  longitude: z.coerce
    .number()
    .min(-180, "Longitude minimal -180 derajat")
    .max(180, "Longitude maksimal 180 derajat"),
  radius_meters: z.coerce
    .number()
    .min(1, "Radius jarak harus berupa bilangan positif"),
  description: z.string().nullable().optional(),
});

export type Office = z.infer<typeof officeSchema>;
export type OfficeDetail = z.infer<typeof officeDetailSchema>;
export type OfficeFormData = z.infer<typeof officeFormSchema>;
