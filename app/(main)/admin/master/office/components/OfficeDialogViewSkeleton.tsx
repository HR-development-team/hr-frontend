import { Building } from "lucide-react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function OfficeDialogViewSkeleton() {
  return (
    <div>
      <div>
        <Card>
          <div className="flex align-items-center gap-2 mb-4">
            <Building className="text-gray-500" />
            <Skeleton className="w-15rem" />
          </div>

          <div className="grid">
            <div className="col-12 lg:col-4">
              <h2 className="mb-2"></h2>
              <div className="flex flex-column gap-4">
                <div className="w-full flex flex-column gap-2">
                  <Skeleton />
                  <Skeleton className="h-5rem" />
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-column gap-2 w-full">
                    <Skeleton />
                    <Skeleton />
                  </div>
                  <div className="flex flex-column gap-2 w-full">
                    <Skeleton />
                    <Skeleton />
                  </div>
                </div>

                <div className="w-full flex flex-column gap-2">
                  <Skeleton />
                  <Skeleton />
                </div>
              </div>
            </div>

            <div className="col-12 md:col-8 flex flex-column gap-2">
              <Skeleton className="w-8rem" />
              <Skeleton className="h-10rem lg:h-full" />
              <Skeleton />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
