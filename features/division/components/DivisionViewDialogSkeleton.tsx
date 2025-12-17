import { Skeleton } from "primereact/skeleton";

export default function DivisionViewDialogSkeleton() {
  return (
    <div className="flex flex-column gap-4">
      <div className="flex flex-column align-items-center p-4 bg-gray-50 border-round-xl border-1 border-gray-200">
        <Skeleton shape="circle" size="3rem" className="mb-3" />
        <Skeleton width="60%" height="2rem" className="mb-2" />
        <Skeleton width="25%" height="1.5rem" />
      </div>

      <div className="grid">
        {/* Card 1 */}
        <div className="col-12 md:col-6">
          <div className="p-3 border-1 border-gray-200 border-round-lg h-full">
            <div className="flex gap-2 mb-2">
              <Skeleton width="1.5rem" height="1rem" />
              <Skeleton width="40%" height="1rem" />
            </div>
            <Skeleton width="80%" height="1.5rem" className="mb-2" />{" "}
            <Skeleton width="30%" height="1.2rem" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-12 md:col-6">
          <div className="p-3 border-1 border-gray-200 border-round-lg h-full">
            <div className="flex gap-2 mb-2">
              <Skeleton width="1.5rem" height="1rem" />
              <Skeleton width="40%" height="1rem" />
            </div>
            <Skeleton width="80%" height="1.5rem" className="mb-2" />
            <Skeleton width="30%" height="1.2rem" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-2 mb-2">
          <Skeleton width="1.5rem" height="1rem" />
          <Skeleton width="20%" height="1rem" />
        </div>
        <Skeleton height="5rem" className="w-full" />
      </div>

      <div className="flex flex-column md:flex-row justify-content-between gap-2 mt-2 pt-3 border-top-1 border-gray-200">
        <Skeleton width="30%" height="1rem" />
        <Skeleton width="30%" height="1rem" />
      </div>
    </div>
  );
}
