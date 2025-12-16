/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema } from "zod";

export function toFormikValidation(schema: ZodSchema<any>) {
  return (values: any) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const fieldErrors = result.error.flatten().fieldErrors;
    const errors: Record<string, string> = {};

    Object.entries(fieldErrors).forEach(([key, value]) => {
      if (value && value.length > 0) {
        errors[key] = value[0];
      }
    });

    return errors;
  };
}
