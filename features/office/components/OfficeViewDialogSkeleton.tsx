import { Map, Network, Radius } from "lucide-react";
import { Skeleton } from "primereact/skeleton";

export default function OfficeViewDialogSkeleton() {
  return (
    <div className="flex flex-column gap-4 mt-2">
      {/* Header Skeleton */}
      <div className="bg-gray-50 p-3 border-round-xl flex gap-3 align-items-center">
        <Skeleton size="3rem" className="border-round-xl" />
        <div className="flex flex-column gap-2 w-full">
          <Skeleton width="30%" height="1rem" />
          <Skeleton width="50%" height="1.5rem" />
        </div>
      </div>

      <div className="grid">
        {/* Details Column */}
        <div className="col-12 lg:col-4">
          <div className="flex flex-column gap-4 text-400">
            {/* Parent Office */}
            <div className="w-full flex flex-column gap-2">
              <div className="flex gap-2 align-items-center">
                <Network size={14} />
                <Skeleton className="w-6rem h-1rem" />
              </div>
              <Skeleton className="h-2rem w-full" />
            </div>

            {/* Address */}
            <div className="w-full flex flex-column gap-2">
              <div className="flex gap-2 align-items-center">
                <Map size={14} />
                <Skeleton className="w-6rem h-1rem" />
              </div>
              <Skeleton className="h-5rem w-full" />
            </div>

            {/* Lat/Lng */}
            <div className="flex gap-2">
              <div className="flex flex-column gap-2 w-full">
                <Skeleton className="h-4rem w-full" />
              </div>
              <div className="flex flex-column gap-2 w-full">
                <Skeleton className="h-4rem w-full" />
              </div>
            </div>

            {/* Radius */}
            <div className="w-full flex flex-column gap-2">
              <div className="flex gap-2 align-items-center">
                <Radius size={14} />
                <Skeleton className="w-6rem h-1rem" />
              </div>
              <Skeleton className="w-4rem h-1rem" />
            </div>
          </div>
        </div>

        {/* Map Column */}
        <div className="col-12 lg:col-8 flex flex-column gap-2">
          <Skeleton className="w-8rem h-1rem" />
          <Skeleton className="h-20rem w-full border-round-xl" />
          <Skeleton className="h-3rem w-full" />
        </div>
      </div>
    </div>
  );
}
