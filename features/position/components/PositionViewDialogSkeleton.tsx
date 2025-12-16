import { Building, UserCheck } from "lucide-react";
import { Skeleton } from "primereact/skeleton";

export default function PositionViewDialogSkeleton() {
  return (
    <div className="flex flex-column gap-4 mt-2">
      {/* Header Skeleton */}
      <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
        <div className="flex gap-3 align-items-start">
          <div className="p-2 bg-white flex align-items-center border-round-xl">
            <UserCheck className="text-gray-300" size={32} />
          </div>
          <div className="flex flex-column gap-2 w-full">
            <Skeleton width="50%" height="1rem" />
            <Skeleton width="30%" height="0.8rem" />
          </div>
        </div>
      </div>

      <div className="flex flex-column gap-4">
        {/* Salary & Description Section */}
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="flex align-items-center gap-2 mb-2">
              <Skeleton width="5rem" height="0.8rem" />
            </div>
            <Skeleton
              width="100%"
              height="2.5rem"
              className="border-round-lg"
            />
          </div>
          <div className="col-12 md:col-6">
            <div className="flex align-items-center gap-2 mb-2">
              <Skeleton width="5rem" height="0.8rem" />
            </div>
            <Skeleton
              width="100%"
              height="2.5rem"
              className="border-round-lg"
            />
          </div>
        </div>

        {/* Organization Structure Section */}
        <div>
          <div className="flex align-items-center gap-2 text-400 mb-3">
            <Building size={16} />
            <Skeleton width="10rem" height="0.8rem" />
          </div>

          <div className="flex flex-column gap-3">
            <div className="flex flex-column md:flex-row gap-3">
              <Skeleton className="w-full h-5rem border-round-xl" />
              <Skeleton className="w-full h-5rem border-round-xl" />
            </div>
            <div className="flex justify-content-center">
              <Skeleton className="w-full md:w-8 h-4rem border-round-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Timestamps */}
      <div className="mt-2 flex flex-column xl:flex-row xl:align-items-center justify-content-between gap-2 border-top-1 border-gray-200 pt-3">
        <div className="flex align-items-center gap-2">
          <Skeleton width="8rem" height="0.8rem" />
        </div>
        <div className="flex align-items-center gap-2">
          <Skeleton width="8rem" height="0.8rem" />
        </div>
      </div>
    </div>
  );
}
