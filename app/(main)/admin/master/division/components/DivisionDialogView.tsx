import { formatDateIDN } from "@/lib/utils/dateFormat";
import { Card } from "primereact/card";
import DivisionDialogViewSkeleton from "./DivisionDialogViewSkeleton";
import { DivisionViewProps } from "@/lib/types/view/divisionViewTypes";
import { GitFork } from "lucide-react";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import { GetDivisionByIdData } from "@/lib/types/division";

export default function DivisionDialogView({
  data,
  isLoading,
  dialogMode,
}: ViewMasterPropsTypes<GetDivisionByIdData>) {
  const isOnViewMode = dialogMode === "view" ? true : false;
  if (isLoading) {
    return <DivisionDialogViewSkeleton />;
  }

  return (
    <div className={`${isOnViewMode ? "line-height-3 text-800" : "hidden"}`}>
      <Card>
        <div className="flex align-items-center gap-2 mb-4">
          <GitFork className="text-blue-500" />
          <span className="font-medium">Detail Data Divisi</span>
        </div>

        <div className="flex flex-column gap-3 xl:flex-row border-bottom-1 border-gray-400 py-4">
          <div className="w-full text-base font-medium">
            <span className="text-500">Nama Divisi</span>
            <p>{data?.name ? data.name : "-"}</p>
            <p className="text-sm font-light font-italic">
              {data?.division_code ? data.division_code : "-"}
            </p>
          </div>

          <div className="w-full text-base font-medium">
            <span className="text-500">Nama Departemen</span>
            <p>{data?.department_name ? data.department_name : "-"}</p>
            <p className="text-sm font-light font-italic">
              {data?.department_code ? data.department_code : "-"}
            </p>
          </div>
        </div>

        <div className="w-full border-bottom-1 border-gray-400 py-3">
          <div className="text-base font-medium col-12 p-3 bg-gray-100 border-round-xl">
            <span>Deskripsi Divisi</span>
            <p className="text-500 font-italic">
              {data?.description ? data.description : "Belum ada deskripsi"}
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
      </Card>
    </div>
  );
}
