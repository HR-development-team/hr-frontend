import { Building } from "lucide-react";
import { Card } from "primereact/card";
import DepartmentDialogViewSkeleton from "./DepartmentDialogViewSkeleton";
import { formatDateIDN } from "@/lib/utils/dateFormat";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import { GetDepartmentByIdData } from "@/lib/types/department";

export default function DepartmentDialogView({
  data,
  isLoading,
  dialogMode,
}: ViewMasterPropsTypes<GetDepartmentByIdData>) {
  const isOnViewMode = dialogMode === "view" ? true : false;

  if (isLoading) {
    return <DepartmentDialogViewSkeleton />;
  }
  return (
    <div className={`${isOnViewMode ? "text-800" : "hidden"}`}>
      <Card className="line-height-3">
        <div className="flex align-items-center gap-2 mb-4">
          <Building className="text-blue-500" />
          <span className="font-medium text-800">Detail Departemen</span>
        </div>
        <div className="grid">
          <div className="col-12 grid border-bottom-1 border-gray-400 py-4">
            <div className="text-base font-medium col-12 md:col-6 ">
              <span className="text-500">Nama Kantor</span>
              <p>{data?.office_name ? data.office_name : "-"}</p>
              <p className="font-mono font-light py-1 px-2 bg-gray-50 border-round-xl max-w-min">
                {data?.office_code ? data.office_code : "-"}
              </p>
            </div>

            <div className="text-base font-medium col-12 md:col-6">
              <span className="text-500">Nama Departemen</span>
              <p>{data?.name ? data.name : "-"}</p>
              <p className="font-mono font-light py-1 px-2 bg-gray-50 border-round-xl max-w-min">
                {data?.department_code ? data.department_code : "-"}
              </p>
            </div>
          </div>

          <div className="text-base font-medium col-12 p-3 bg-gray-100 border-round-xl mt-3">
            <span>Deskripsi Departemen</span>
            <p className="text-500 font-italic">
              {data?.description ? data.description : "-"}
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
