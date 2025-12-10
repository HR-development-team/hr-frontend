import { formatDateIDN } from "@/lib/utils/dateFormat";
import { formatRupiah } from "@/lib/utils/formatRupiah";
import { Building, UserCheck } from "lucide-react";
import { Card } from "primereact/card";
import PositionDialogViewSkeleton from "./PositionDialogViewSkeleton";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import { GetPositionByIdData } from "@/lib/types/position";

export default function PositionDialogView({
  data,
  isLoading,
  dialogMode,
}: ViewMasterPropsTypes<GetPositionByIdData>) {
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
              <p>{data?.name ? data.name : "-"}</p>
              <p className="text-sm font-light font-mono">
                {data?.position_code ? data.position_code : "-"}
              </p>
            </div>

            <div className="text-base font-medium">
              <span className="text-500">Gaji Pokok</span>
              <p>{data?.base_salary ? formatRupiah(data.base_salary) : "-"}</p>
            </div>
          </div>

          <div className="w-full border-bottom-1 border-gray-400 py-3">
            <div className="text-base font-medium col-12 p-3 bg-gray-100 border-round-xl">
              <span>Deskripsi Posisi</span>
              <p className="text-500 font-italic">
                {data?.description ? data.description : "Belum ada deskripsi"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex align-items-center gap-2 mt-2 mb-4">
            <Building className="text-blue-500" />
            <span className="font-medium text-800">Struktur Organisasi</span>
          </div>

          <div >
            <div className="flex flex-column md:flex-row md:justify-content-between gap-4">
              <div className="w-full text-base font-medium bg-gray-100 p-3 border-round-xl md:w-6">
                <span className="text-500">Departemen</span>
                <p>{data?.department_name ? data.department_name : "-"}</p>
                <p className="text-sm text-500 font-light font-mono">
                  {data?.department_code ? data.department_code : "-"}
                </p>
              </div>

              <div className="w-full text-base font-medium bg-gray-100 p-3 border-round-xl md:w-6">
                <span className="text-500">Divisi</span>
                <p>{data?.division_name ? data.division_name : "-"}</p>
                <p className="text-sm text-500 font-light font-mono">
                  {data?.division_code ? data.division_code : "-"}
                </p>
              </div>
            </div>

            <div className="w-full text-base font-medium bg-gray-100 p-3 border-round-xl mt-4 mx-auto md:w-6">
              <span className="text-500">Induk Jabatan</span>
              <p>
                {data?.parent_position_name ? data.parent_position_name : "-"}
              </p>
              <p className="text-sm text-500 font-light font-italic">
                {data?.parent_position_code ? data.parent_position_code : "-"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-column xl:flex-row xl:align-items-center justify-content-between font-italic text-xs">
            <div className="font-light flex align-items-center gap-2 text-500">
              <span className="">Diperbarui:</span>
              <span>{formatDateIDN(data?.updated_at)}</span>
            </div>

            <div className="font-light flex align-items-center gap-2 text-500">
              <span className="">Ditambahkan:</span>
              <span>{formatDateIDN(data?.created_at)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
