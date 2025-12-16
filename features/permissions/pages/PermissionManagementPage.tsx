"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Settings2 } from "lucide-react";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { usePagePermission } from "../hooks/usePagePermission";
import RolePermissionTable from "../components/RolePermissionTable";

export default function PermissionManagementPage() {
  const router = useRouter();

  const {
    roleName,
    permissionsList,
    isLoading,
    isSaving,
    hasChanges,
    updateLocalPermission,
    handleSave,
  } = usePagePermission();

  return (
    <div>
      {/* Title Section */}
      <div className="mb-6 flex justify-content-between align-items-center mt-4 mb-6">
        <div className="flex align-items-center gap-3">
          <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
            <Shield className="w-2rem h-2rem" />
          </div>

          <div>
            <div className="flex gap-3 align-items-center mb-2">
              <h1 className="text-lg md:text-2xl font-bold text-gray-800 m-0">
                Kelola Permissions Role
              </h1>
              <Badge
                className="text-xs h-auto"
                value={roleName}
                severity="info"
              />
            </div>
            <p className="text-sm md:text-md text-gray-500 m-0">
              Atur hak akses untuk setiap fitur pada role ini
            </p>
          </div>
        </div>

        <div>
          <Button
            label="Kembali"
            icon={<ArrowLeft className="w-1rem h-1rem mr-2" />}
            className="p-button-text p-button-secondary p-button-sm"
            outlined
            onClick={() => router.back()}
          />
        </div>
      </div>

      <Card>
        <div className="flex flex-column gap-4">
          <div className="flex flex-column md:flex-row justify-content-between md:align-items-center gap-3">
            <div className="flex gap-2 align-items-center">
              <Settings2 className="w-1rem h-1rem" />
              <div className="flex gap-2 flex-column">
                <h2 className="text-base text-800 font-semibold m-0">
                  Pengaturan Permissions
                </h2>
                <p className="text-sm text-gray-500 m-0">
                  Centang opsi untuk memberikan akses fitur
                </p>
              </div>
            </div>

            <Button
              icon="pi pi-save"
              label="Simpan Perubahan"
              severity="info"
              pt={{ icon: { className: "mr-2" } }}
              disabled={!hasChanges || isLoading}
              loading={isSaving}
              onClick={handleSave}
              className="w-full md:w-auto"
            />
          </div>

          <RolePermissionTable
            permissionsList={permissionsList}
            isLoading={isLoading}
            roleName={roleName}
            onPermissionChange={updateLocalPermission}
          />
        </div>
      </Card>
    </div>
  );
}
