import z from "zod";

export const officeFormSchema = z.object({
  name: z
    .string()
    .min(3, "Nama kantor harus minimal 3 karakter")
    .nonempty("Nama kantor wajib diisi"),
  address: z.string().nonempty("Alamat kantor wajib diisi"),
  latitude: z
    .number()
    .min(-90, "Latitude minimal -90 derajat")
    .max(90, "Latitud maksimal 90 derajat"),
  longitude: z
    .number()
    .min(-180, "Longitude minimal -180 derajat")
    .max(180, "Longitude maksimal 180 derajat"),
  radius_meters: z.number().min(0, 'Radius jarak harus berupa bilangan positif'),
});

export type OfficeFormData = z.infer<typeof officeFormSchema>;
