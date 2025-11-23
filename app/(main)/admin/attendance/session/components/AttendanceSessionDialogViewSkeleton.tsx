import { Calendar } from "lucide-react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function AttendanceSessionDialogViewSkeleton() {
  return (
    <div>
      <Card>
        <div className="flex align-items-center gap-2 mb-4">
          <Calendar className="text-gray-500" />
          <Skeleton className="w-12rem" />
        </div>

        <div className="grid">
          <div className="col-12 flex justify-content-between border-bottom-1 border-gray-400 py-4">
            <div className="flex flex-column gap-2">
              <Skeleton className="w-5rem" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="flex flex-column gap-2 align-items-end">
              <Skeleton className="w-6rem" />
              <Skeleton className="w-10rem" />
            </div>
          </div>

          <Skeleton className="w-full h-8rem mt-3 border-round-xl" />
        </div>
      </Card>
    </div>
  );
}
