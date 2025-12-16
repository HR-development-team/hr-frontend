/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { updatePermissions } from "../services/permissionApi";
import { useToastContext } from "@components/ToastProvider";
import {
  FeaturePermission,
  UpdatePermissionsPayload,
} from "../schemas/permissionSchema";

export function useSavePermissions(onSuccess?: () => void) {
  const { showToast } = useToastContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  /**
   * Transform the internal read-model (0/1) to the write-payload (boolean)
   */
  const mapToApiPayload = (
    permissions: FeaturePermission[]
  ): UpdatePermissionsPayload => {
    return {
      permissions: permissions.map((perm) => ({
        feature_code: perm.feature_code,
        can_create: perm.can_create === 1,
        can_read: perm.can_read === 1,
        can_update: perm.can_update === 1,
        can_delete: perm.can_delete === 1,
        can_print: perm.can_print === 1,
      })),
    };
  };

  /**
   * Execute the Save Operation
   */
  const savePermissions = async (
    roleCode: string,
    permissions: FeaturePermission[]
  ) => {
    try {
      setIsSaving(true);

      const payload = mapToApiPayload(permissions);
      await updatePermissions(roleCode, payload);

      showToast("success", "Berhasil", "Permissions berhasil diperbarui");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      showToast("error", "Gagal", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    savePermissions,
    isSaving,
  };
}
