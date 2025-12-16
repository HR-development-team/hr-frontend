import { User } from "lucide-react";
import { Skeleton } from "primereact/skeleton";

export default function EmployeeViewDialogSkeleton() {
  return (
    <div className="flex flex-column gap-4 mt-2">
      {/* Header Skeleton */}
      <div className="bg-blue-50 p-3 border-round-xl border-1 border-blue-100">
        <div className="flex gap-3 align-items-center">
          <div className="p-2 bg-white flex align-items-center border-round-circle border-1 border-gray-100">
            <User className="text-gray-300" size={48} />
          </div>
          <div className="flex flex-column gap-2 w-full">
            <Skeleton width="50%" height="1.2rem" />
            <Skeleton width="30%" height="0.8rem" />
            <Skeleton
              width="5rem"
              height="1.5rem"
              className="border-round-xl"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-column gap-4">
        {/* Job Info Section */}
        <div className="grid">
          <div className="col-12 md:col-6">
            <Skeleton width="8rem" height="1rem" className="mb-2" />
            <Skeleton width="100%" height="5rem" className="border-round-lg" />
          </div>
          <div className="col-12 md:col-6">
            <Skeleton width="8rem" height="1rem" className="mb-2" />
            <Skeleton width="100%" height="5rem" className="border-round-lg" />
          </div>
        </div>

        {/* Personal Info Section */}
        <div>
          <Skeleton width="10rem" height="1rem" className="mb-3" />
          <div className="grid">
            <div className="col-6 md:col-3">
              <Skeleton width="100%" height="3rem" />
            </div>
            <div className="col-6 md:col-3">
              <Skeleton width="100%" height="3rem" />
            </div>
            <div className="col-6 md:col-3">
              <Skeleton width="100%" height="3rem" />
            </div>
            <div className="col-6 md:col-3">
              <Skeleton width="100%" height="3rem" />
            </div>
          </div>
        </div>

        {/* Docs Section */}
        <div>
          <Skeleton width="10rem" height="1rem" className="mb-3" />
          <Skeleton width="100%" height="4rem" className="border-round-lg" />
        </div>
      </div>

      {/* Footer Timestamps */}
      <div className="mt-2 flex flex-column xl:flex-row xl:align-items-center justify-content-between gap-2 border-top-1 border-gray-200 pt-3">
        <Skeleton width="10rem" height="0.8rem" />
        <Skeleton width="10rem" height="0.8rem" />
      </div>
    </div>
  );
}
