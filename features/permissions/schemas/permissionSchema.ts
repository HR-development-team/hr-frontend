import { z } from "zod";

const binaryFlag = z.union([z.literal(0), z.literal(1)]);

export const featurePermissionSchema = z.object({
  role_code: z.string().min(1, "Role code is required"),
  feature_code: z.string().min(1, "Feature code is required"),
  feature_name: z.string().min(1, "Feature name is required"),
  can_create: binaryFlag,
  can_read: binaryFlag,
  can_update: binaryFlag,
  can_delete: binaryFlag,
  can_print: binaryFlag,
});

export const rolePermissionsDataSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  permissions: z.array(featurePermissionSchema),
});

export const featurePermissionPayloadSchema = z.object({
  feature_code: z.string().min(1, "Feature code is required"),
  can_create: z.boolean(),
  can_read: z.boolean(),
  can_update: z.boolean(),
  can_delete: z.boolean(),
  can_print: z.boolean(),
});

export const updatePermissionsPayloadSchema = z.object({
  permissions: z.array(featurePermissionPayloadSchema),
});

export type FeaturePermission = z.infer<typeof featurePermissionSchema>;
export type RolePermissionsData = z.infer<typeof rolePermissionsDataSchema>;
export type FeaturePermissionPayload = z.infer<
  typeof featurePermissionPayloadSchema
>;
export type UpdatePermissionsPayload = z.infer<
  typeof updatePermissionsPayloadSchema
>;
