import { Building, Building2, Calendar, FileText } from "lucide-react";
import { Skeleton } from "primereact/skeleton";

export default function DepartmentViewDialogSkeleton() {
  return (
    <div className="flex flex-column gap-4 mt-2">
      {/* Header Skeleton */}
      <div className="bg-gray-50 p-3 border-round-xl border-1 border-gray-200">
        <div className="flex gap-3 align-items-start">
          <div className="p-2 bg-white flex align-items-center border-round-xl">
            <Building className="text-gray-300" size={32} />
          </div>
          <div className="flex flex-column gap-2 w-full">
            <Skeleton width="40%" height="1rem" />
            <Skeleton width="60%" height="1.5rem" />
            <Skeleton width="30%" height="1rem" className="mt-1" />
          </div>
        </div>
      </div>

      <div className="flex flex-column gap-4">
        {/* Office Section */}
        <div>
          <div className="flex align-items-center gap-2 text-400 mb-2">
            <Building2 size={14} />
            <Skeleton width="10rem" height="0.8rem" />
          </div>
          <Skeleton height="4rem" className="border-round-lg w-full" />
        </div>

        {/* Description Section */}
        <div>
          <div className="flex align-items-center gap-2 text-400 mb-2">
            <FileText size={14} />
            <Skeleton width="6rem" height="0.8rem" />
          </div>
          <Skeleton height="5rem" className="border-round-lg w-full" />
        </div>
      </div>

      {/* Footer Timestamps */}
      <div className="mt-2 flex flex-column xl:flex-row xl:align-items-center justify-content-between gap-2">
        <div className="flex align-items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <Skeleton width="8rem" height="0.8rem" />
        </div>
        <div className="flex align-items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <Skeleton width="8rem" height="0.8rem" />
        </div>
      </div>
    </div>
  );
}
