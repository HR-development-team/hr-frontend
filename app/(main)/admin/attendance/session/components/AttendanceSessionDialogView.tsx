import { Calendar, Clock } from "lucide-react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import AttendanceSessionDialogViewSkeleton from "./AttendanceSessionDialogViewSkeleton";
import { formatDateIDN } from "@/lib/utils/dateFormat";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import { GetAttendanceSessionByIdData } from "@/lib/types/attendanceSession";

export default function AttendanceSessionDialogView({
  data,
  isLoading,
  dialogMode,
}: ViewMasterPropsTypes<GetAttendanceSessionByIdData>) {
  const isOnViewMode = dialogMode === "view" ? true : false;

  // Helper for Status
  const isClosed = data?.status === "closed";

  if (isLoading) {
    return <AttendanceSessionDialogViewSkeleton />;
  }

  return (
    <div className={`${isOnViewMode ? "text-800" : "hidden"}`}>
      <Card className="line-height-3">
        {/* Header Section */}
        <div className="flex align-items-center gap-2 mb-4">
          <Calendar className="text-blue-500" />
          <span className="font-medium text-800">Detail Sesi Absensi</span>
        </div>

        <div className="grid">
          {/* Row 1: Code and Date (Mimics Department ID and Name) */}
          <div className="col-12 flex justify-content-between border-bottom-1 border-gray-400 py-4">
            <div className="text-base font-medium">
              <span className="text-500">Kode Sesi</span>
              <p className="font-light font-italic">
                {data?.session_code ? data.session_code : "-"}
              </p>
            </div>

            <div className="text-base font-medium text-right">
              <span className="text-500">Tanggal Sesi</span>
              <p>{formatDateIDN(data?.date)}</p>
            </div>
          </div>

          {/* Row 2: Time Details & Status (Mimics Department Description Box) */}
          <div className="col-12 p-3 bg-gray-100 border-round-xl mt-3">
            <div className="flex justify-content-between align-items-center mb-2">
              <span className="text-base font-medium">Status Sesi</span>
              <Tag
                value={isClosed ? "TUTUP" : "BUKA"}
                severity={isClosed ? "danger" : "success"}
              />
            </div>

            <div className="grid mt-2">
              <div className="col-6">
                <div className="flex align-items-center gap-2 text-500 mb-1">
                  <Clock size={16} />
                  <span className="text-sm">Waktu Sesi</span>
                </div>
                <p className="font-medium">
                  {data?.open_time ? data.open_time.substring(0, 5) : "--:--"} -{" "}
                  {data?.close_time ? data.close_time.substring(0, 5) : "--:--"}
                </p>
              </div>
              <div className="col-6">
                <div className="flex align-items-center gap-2 text-500 mb-1">
                  <Clock size={16} className="text-red-400" />
                  <span className="text-sm">Batas Terlambat</span>
                </div>
                <p className="font-medium">
                  {data?.cutoff_time
                    ? data.cutoff_time.substring(0, 5)
                    : "--:--"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section: Timestamps */}
        <div className="mt-4 flex flex-column xl:flex-row xl:align-items-center justify-content-between font-italic text-xs">
          <div className="font-light flex align-items-center gap-2 text-500">
            <span className="">Diperbarui:</span>
            <span>{formatDateIDN(data?.updated_at)}</span>
          </div>

          <div className="font-light flex align-items-center gap-2 text-500">
            <span className="">Dibuat:</span>
            <span>{formatDateIDN(data?.created_at)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
