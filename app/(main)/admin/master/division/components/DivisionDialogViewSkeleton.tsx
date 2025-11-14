import { Building, GitFork, UserCheck } from "lucide-react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function DivisionDialogViewSkeleton() {
  return (
    <div>
      <Card>
        <div className="flex align-items-center gap-2 mb-4">
          <GitFork className="text-gray-500" />
          <Skeleton className="w-8rem" />
        </div>

        <div>
          <div className="flex flex-column gap-3 xl:flex-row border-bottom-1 border-gray-400 py-4">
            <div className="w-full flex flex-column gap-2">
              <Skeleton />
              <Skeleton className="w-4rem" />
            </div>
            <div className="w-full flex flex-column gap-2">
              <Skeleton />
              <Skeleton className="w-4rem" />
            </div>
          </div>

          <div className="w-full border-bottom-1 border-gray-400 py-3">
            <Skeleton className="w-full h-5rem" />
          </div>
        </div>

        <div className="mt-4 flex flex-column gap-4 xl:flex-row xl:align-items-center justify-content-between font-italic text-xs">
          <Skeleton />

          <Skeleton />
        </div>
      </Card>
    </div>
  );
}
