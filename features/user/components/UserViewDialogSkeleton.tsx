import { User } from "lucide-react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function UserDialogViewSkeleton() {
  return (
    <div>
      <Card className="line-height-3">
        <div className="flex align-items-center gap-2 mb-4">
          <User className="text-gray-500" />
          <Skeleton className="w-10rem" />
        </div>
        <div className="grid">
          <div className="col-12 flex justify-content-between gap-4 border-bottom-1 border-gray-400 py-4">
            <div className="flex flex-column gap-2">
              <Skeleton className="w-10rem" />
              <Skeleton />
              <Skeleton className="w-8rem" />
            </div>

            <div className="flex flex-column gap-2">
              <Skeleton className="w-10rem" />
              <Skeleton className="w-8rem" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-column xl:flex-row xl:align-items-center gap-4 justify-content-between">
          <Skeleton />

          <Skeleton />
        </div>
      </Card>
    </div>
  );
}
