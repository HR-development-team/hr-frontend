import { PositionViewProps } from "@/lib/types/view/positionViewTypes";
import { formatDateIDN } from "@/lib/utils/dateFormat";
import { formatRupiah } from "@/lib/utils/formatRupiah";
import { Building, UserCheck } from "lucide-react";
import { Card } from "primereact/card";
import PositionDialogViewSkeleton from "./PositionDialogViewSkeleton";

export default function PositionDialogView({
  positionData,
  isLoading,
  dialogMode,
}: PositionViewProps) {
  const isOnViewMode = dialogMode === "view" ? true : false;
  if (isLoading) {
    return <PositionDialogViewSkeleton />;
  }

  return (
    <div className={`${isOnViewMode ? "line-height-3 text-800" : "hidden"}`}>
      <Card>
        <div className="flex align-items-center gap-2 mb-4">
          <UserCheck className="text-blue-500" />
          <span className="font-medium">Detail Data Posisi</span>
        </div>

        <div className="">
          <div className="flex flex-column gap-3 xl:flex-row border-bottom-1 border-gray-400 py-4">
            <div className="w-full text-base font-medium">
              <span className="text-500">Nama Posisi</span>
              <p>{positionData?.name ? positionData.name : "-"}</p>
              <p className="text-sm font-light font-italic">
                {positionData?.position_code ? positionData.position_code : "-"}
              </p>
            </div>

            <div className="text-base font-medium">
              <span className="text-500">Gaji Pokok</span>
              <p>
                {positionData?.base_salary
                  ? formatRupiah(positionData.base_salary)
                  : "-"}
              </p>
            </div>
          </div>

          <div className="w-full border-bottom-1 border-gray-400 py-3">
            <div className="text-base font-medium col-12 p-3 bg-gray-100 border-round-xl">
              <span>Deskripsi Posisi</span>
              <p className="text-500 font-italic">
                {positionData?.description
                  ? positionData.description
                  : "Belum ada deskripsi"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex align-items-center gap-2 mt-2 mb-4">
            <Building className="text-blue-500" />
            <span className="font-medium text-800">Struktur Organisasi</span>
          </div>

          <div className="flex justify-content-between gap-4">
            <div className="w-full text-base font-medium bg-gray-100 p-3 border-round-xl md:w-6">
              <span className="text-500">Departemen</span>
              <p>
                {positionData?.department_name
                  ? positionData.department_name
                  : "-"}
              </p>
              <p className="text-sm text-500 font-light font-italic">
                {positionData?.department_code
                  ? positionData.department_code
                  : "-"}
              </p>
            </div>

            <div className="w-full text-base font-medium bg-gray-100 p-3 border-round-xl md:w-6">
              <span className="text-500">Divisi</span>
              <p>
                {positionData?.division_name ? positionData.division_name : "-"}
              </p>
              <p className="text-sm text-500 font-light font-italic">
                {positionData?.division_code ? positionData.division_code : "-"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-column xl:flex-row xl:align-items-center justify-content-between font-italic text-xs">
            <div className="font-light flex align-items-center gap-2 text-500">
              <span className="">Diperbarui:</span>
              <span>{formatDateIDN(positionData?.updated_at)}</span>
            </div>

            <div className="font-light flex align-items-center gap-2 text-500">
              <span className="">Ditambahkan:</span>
              <span>{formatDateIDN(positionData?.created_at)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
