export interface FeaturePermission {
  role_code: string;
  feature_code: string;
  feature_name: string;
  can_create: 0 | 1;
  can_read: 0 | 1;
  can_update: 0 | 1;
  can_delete: 0 | 1;
  can_print: 0 | 1;
}

export interface RolePermissionsData {
  role_name: string;
  permissions: FeaturePermission[];
}

export interface FeaturePermissionPayload {
  feature_code: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_print: boolean;
}

export interface UpdatePermissionsPayload {
  permissions: FeaturePermissionPayload[];
}
