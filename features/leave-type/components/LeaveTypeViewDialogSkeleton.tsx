import { CalendarOff, FileText } from "lucide-react";
import { Skeleton } from "primereact/skeleton";

export default function LeaveViewDialogSkeleton() {
  return (
    <div className="flex flex-column gap-4 mt-2">
      {/* Header Skeleton */}
      <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
        <div className="flex gap-3 align-items-center">
          <div className="p-2 bg-white flex align-items-center border-round-lg">
            <CalendarOff className="text-gray-300" size={32} />
          </div>
          <div className="flex flex-column gap-2 w-full">
            <Skeleton width="40%" height="1rem" />
            <Skeleton width="20%" height="0.8rem" />
          </div>
        </div>
      </div>

      <div className="flex flex-column gap-4">
        {/* Info Grid */}
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="flex align-items-center gap-2 mb-2">
              <Skeleton width="6rem" height="0.8rem" />
            </div>
            <Skeleton width="100%" height="3rem" className="border-round-lg" />
          </div>
          <div className="col-12 md:col-6">
            <div className="flex align-items-center gap-2 mb-2">
              <Skeleton width="6rem" height="0.8rem" />
            </div>
            <Skeleton width="100%" height="3rem" className="border-round-lg" />
          </div>
        </div>

        {/* Description Section */}
        <div>
          <div className="flex align-items-center gap-2 text-400 mb-2">
            <FileText size={16} />
            <Skeleton width="8rem" height="0.8rem" />
          </div>
          <Skeleton width="100%" height="5rem" className="border-round-lg" />
        </div>
      </div>

      {/* Footer Timestamps */}
      <div className="mt-2 flex flex-column xl:flex-row xl:align-items-center justify-content-between gap-2 border-top-1 border-gray-200 pt-3">
        <Skeleton width="8rem" height="0.8rem" />
        <Skeleton width="8rem" height="0.8rem" />
      </div>
    </div>
  );
}
