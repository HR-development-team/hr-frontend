"use client";

import { useFetch } from "@/lib/hooks/useFetch";
import {
  FeaturePermission,
  RolePermissionsData,
  UpdatePermissionsPayload,
} from "@/lib/types/permission";
import { ArrowLeft, Settings2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEffect, useState, useCallback } from "react";
import RolePermissionTable from "./components/RolePermissionTable";
import { useSubmit } from "@/lib/hooks/useSubmit";
import { useToastContext } from "@/components/ToastProvider";

// --- Helper function to compare two FeaturePermission arrays ---
const isListEqual = (
  list1: FeaturePermission[],
  list2: FeaturePermission[]
) => {
  // Deep comparison using JSON.stringify for complex ordered arrays
  return JSON.stringify(list1) === JSON.stringify(list2);
};

const mapToApiPayload = (
  permissions: FeaturePermission[]
): UpdatePermissionsPayload => {
  const payloadPermissions = permissions.map((perm) => ({
    feature_code: perm.feature_code,
    can_create: perm.can_create === 1,
    can_read: perm.can_read === 1,
    can_update: perm.can_update === 1,
    can_delete: perm.can_delete === 1,
    can_print: perm.can_print === 1,
  }));

  return { permissions: payloadPermissions };
};

export default function PermissionPage() {
  const [roleData, setRoleData] = useState<RolePermissionsData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 1. NEW STATE: To track the original data fetched from the API
  const [originalPermissionsList, setOriginalPermissionsList] = useState<
    FeaturePermission[]
  >([]);

  const { isLoading, fetchData } = useFetch();
  const { isSaving, submitData } = useSubmit();

  const { showToast } = useToastContext();

  const permissionsList = roleData?.permissions || [];
  const roleName = roleData?.role_name || "N/A";

  const params = useParams();
  const roleCode = String(params.roleCode);
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  // --- Data Fetching Logic (Updated) ---
  const fetchPermissionByRoleCode = useCallback(
    async (code: string) => {
      await fetchData({
        url: `/api/admin/management/permission/${code}`,
        onSuccess: (responseData) => {
          const permissions = responseData.role_permissions?.permissions || [];
          const roleName = responseData.role_permissions?.role_name || "";

          setRoleData({ role_name: roleName, permissions });

          // 2. Set original state on successful fetch (deep clone)
          setOriginalPermissionsList(structuredClone(permissions));
          setHasChanges(false);
        },
        onError: () => {
          setRoleData({ role_name: "", permissions: [] });
          setOriginalPermissionsList([]);
          setHasChanges(false);
        },
      });
    },
    [fetchData]
  );

  // --- Permission Update Logic (Handles Reversal) ---
  const handlePermissionChange = (
    featureCode: string,
    field: keyof FeaturePermission,
    value: boolean
  ) => {
    const numericValue = value ? 1 : 0;

    setRoleData((prevRoleData) => {
      if (!prevRoleData) return null;

      const updatedPermissions = prevRoleData.permissions.map((perm) => {
        if (perm.feature_code === featureCode) {
          if (perm[field] === numericValue) {
            return perm;
          }
          return { ...perm, [field]: numericValue };
        }
        return perm;
      });

      // 3. Compare the updated list against the original list
      const isDirty = !isListEqual(updatedPermissions, originalPermissionsList);

      setHasChanges(isDirty);

      return {
        ...prevRoleData,
        permissions: updatedPermissions,
      };
    });

    console.log(
      `[Local Update] Feature: ${featureCode}, Field: ${field}, Value: ${numericValue}`
    );
  };

  // --- Save Logic ---
  const handleSavePermissions = async () => {
    if (!hasChanges || isLoading) return;

    // 1. Construct the API Payload
    const payload: UpdatePermissionsPayload = mapToApiPayload(permissionsList);

    // 2. Define URL and Method
    const url = `/api/admin/management/permission/${roleCode}`;

    await submitData({
      url: url,
      payload: payload,
      showToast: showToast,
      method: "PUT",
      onSuccess: () => {
        fetchPermissionByRoleCode(roleCode);
      },
    });
  };

  // --- Initial Fetch Effect ---
  useEffect(() => {
    if (roleCode && roleCode !== "undefined" && roleCode !== "null") {
      fetchPermissionByRoleCode(roleCode);
    }
  }, [roleCode]);

  // --- Render ---
  return (
    <div className="p-4">
      {/* Header Block */}
      <div className="mb-6 flex justify-content-between align-items-center mt-4 mb-6">
        <div className="flex align-items-center gap-3">
          {/* Header Icon */}
          <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
            <Settings2 className="w-2rem h-2rem" />
          </div>

          {/* Header Content */}
          <div>
            <div className="flex gap-3 align-items-center mb-2">
              <h1 className="text-lg md:text-2xl font-bold text-gray-800">
                Kelola Permissions Role
              </h1>
              <Badge
                className="text-xs h-auto"
                value={roleName}
                severity="info"
              ></Badge>
            </div>
            <p className="text-sm md:text-md text-gray-500">
              Atur hak akses untuk setiap fitur pada role ini
            </p>
          </div>
        </div>
        {/* Back Button */}
        <div>
          <Button
            label="Kembali"
            icon={<ArrowLeft className="w-1rem h-1rem mr-2" />}
            className="p-button-text p-button-secondary p-button-sm outline"
            outlined
            onClick={handleGoBack}
          />
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex justify-content-between align-items-center">
            <div className="flex gap-2 align-items-center">
              <Settings2 className="w-1rem h-1rem" />
              <div className="flex gap-2 flex-column">
                <h2 className="text-base text-800 font-semibold">
                  Pengaturan Permissions
                </h2>
                <p className="text-sm md:text-md text-gray-500">
                  Tentukan hak akses untuk setiap fitur yang tersedia
                </p>
              </div>
            </div>

            <Button
              icon="pi pi-save"
              label="Simpan Perubahan"
              severity="info"
              pt={{
                icon: { className: "mr-2" },
              }}
              // Disabled if: 1. No changes OR 2. Loading
              disabled={!hasChanges || isLoading}
              onClick={handleSavePermissions}
            />
          </div>

          <RolePermissionTable
            permissionsList={permissionsList}
            isLoading={isLoading}
            roleName={roleName}
            onPermissionChange={handlePermissionChange}
          />
        </div>
      </Card>
    </div>
  );
}
