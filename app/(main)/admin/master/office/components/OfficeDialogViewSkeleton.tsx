import { Building, Map, Network, QrCode, Radius } from "lucide-react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function OfficeDialogViewSkeleton() {
  const titleTemplate = () => {
    return (
      <div className="bg-gray-50 p-3 border-round-xl">
        <div className="p-2 bg-white flex align-items-center border-round-xl max-w-min">
          <Building className="text-gray-500" size={32} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <Card title={titleTemplate}>
          <div className="grid">
            <div className="col-12 lg:col-4">
              <h2 className="mb-2"></h2>
              <div className="flex flex-column gap-4 text-400">
                <div className="w-full flex flex-column gap-2">
                  <div className="flex gap-2 align-items-center">
                    <Network size={14} />
                    <Skeleton className="w-6" />
                  </div>
                  <Skeleton className="h-2rem" />
                </div>

                <div className="w-full flex flex-column gap-2">
                  <div className="flex gap-2 align-items-center">
                    <Map size={14} />
                    <Skeleton className="w-6" />
                  </div>
                  <Skeleton className="h-5rem" />
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-column gap-2 w-full">
                    <Skeleton className="h-4rem" />
                  </div>
                  <div className="flex flex-column gap-2 w-full">
                    <Skeleton className="h-4rem" />
                  </div>
                </div>

                <div className="w-full flex flex-column gap-2">
                  <div className="flex gap-2 align-items-center">
                    <Radius size={14} />
                    <Skeleton className="w-6" />
                  </div>
                  <Skeleton className="w-6" />
                </div>

                <div className="w-full flex flex-column gap-2">
                  <Skeleton className="w-6" />
                  <Skeleton className="h-5rem" />
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
