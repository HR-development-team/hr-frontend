"use client";

import { User as UserIcon } from "lucide-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { UserDetail } from "../schemas/userSchema";
import UserDialogViewSkeleton from "./UserDialogViewSkeleton";

interface UserViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetail | null;
  isLoading: boolean;
}

export default function UserViewDialog({
  isOpen,
  onClose,
  user,
  isLoading,
}: UserViewDialogProps) {
  const renderFooter = () => (
    <div className="flex justify-content-end">
      <Button label="Tutup" icon="pi pi-times" text onClick={onClose} />
    </div>
  );

  return (
    <Dialog
      header="Detail User"
      visible={isOpen}
      onHide={onClose}
      modal
      className="w-full md:w-5"
      footer={renderFooter()}
    >
      {isLoading ? (
        <UserDialogViewSkeleton />
      ) : user ? (
        <div className="flex flex-column gap-4 mt-2">
          {/* Header / Identity Section */}
          <div className="flex align-items-center gap-3 p-3 bg-blue-50 border-round">
            <div className="bg-blue-100 p-2 border-round-circle">
              <UserIcon className="text-blue-600 w-2rem h-2rem" />
            </div>
            <div className="flex flex-column">
              <span className="font-bold text-gray-800 text-lg">
                {user.employee_name || user.email}
              </span>
              <span className="text-gray-500 text-sm">{user.user_code}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid">
            {/* Email */}
            <div className="col-12 md:col-6">
              <div className="text-500 mb-1 text-sm">Email</div>
              <div className="font-medium text-900">{user.email}</div>
            </div>

            {/* Role */}
            <div className="col-12 md:col-6">
              <div className="text-500 mb-1 text-sm">Role</div>
              <div className="font-medium text-900">
                {/* Uses role_name from the schema */}
                {user.role_name}
              </div>
            </div>

            {/* Timestamps (Optional, but good for Detail Views) */}
            <div className="col-12 md:col-6">
              <div className="text-500 mb-1 text-sm">Dibuat Pada</div>
              <div className="text-900">{user.created_at || "-"}</div>
            </div>

            <div className="col-12 md:col-6">
              <div className="text-500 mb-1 text-sm">Terakhir Diupdate</div>
              <div className="text-900">{user.updated_at || "-"}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 text-gray-500">
          Data user tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
