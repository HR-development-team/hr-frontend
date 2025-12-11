import { Building, Building2, Calendar, FileText, QrCode } from "lucide-react";
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

  const titleTemplate = () => {
    return (
      <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
        <div className="flex gap-2 align-items-start">
          <div className="p-2 bg-white flex align-items-center border-round-xl">
            <Building className="text-blue-500" size={32} />
          </div>
          <div className="flex flex-column justify-content-start gap-1">
            <span className="font-medium text-sm text-blue-600">
              DETAIL DEPARTEMEN{" "}
            </span>
            <h2 className=" text-lg">
              {data?.name ? data.name : "Kantor belum diberi nama"}
            </h2>
            <div className="flex gap-2 align-items-center p-1 border-round-sm bg-blue-600 text-white max-w-min">
              <QrCode size={14} />
              <span className="font-mono text-sm font-normal">
                {data?.department_code ? data.department_code : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isOnViewMode ? "text-800" : "hidden"}`}>
      <Card className="line-height-3" title={titleTemplate}>
        <div className="">
          <div className="border-bottom-1 border-gray-400 pb-4">
            <div className="font-medium">
              <div className="flex align-items-center gap-2 text-400 mb-2">
                <Building2 size={14} />
                <span className="text-xs">LOKASI KANTOR CABANG</span>
              </div>
              <div className="p-3 bg-gray-50 border-round-lg border-1 border-gray-100">
                <p className="text-sm">
                  {data?.office_name ? data.office_name : "-"}
                </p>
                <p className="font-mono font-light text-xs">
                  {data?.office_code ? data.office_code : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex align-items-center gap-2 text-400 mb-2">
              <FileText size={14} />
              <span className="text-xs" >DESKRIPSI</span>
            </div>
            <p className="p-3 bg-gray-50 border-round-lg border-1 border-gray-100 text-sm">
              {data?.description ? data.description : "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-column xl:flex-row xl:align-items-center justify-content-between font-italic text-xs">
          <div className="font-light flex align-items-center gap-2 text-400">
            <Calendar size={14} />
            <span>Diperbarui:</span>
            <span>{formatDateIDN(data?.updated_at)}</span>
          </div>

          <div className="font-light flex align-items-center gap-2 text-400">
            <Calendar size={14} />
            <span>Ditambahkan:</span>
            <span>{formatDateIDN(data?.created_at)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
