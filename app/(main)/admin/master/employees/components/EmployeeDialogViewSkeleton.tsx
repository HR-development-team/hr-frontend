import { Briefcase, IdCard, Phone, User } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function EmployeeDialogViewSkeleton() {
  return (
    <div>
      <div className="grid">
        {/* employee profile and name */}
        <div className="col-12 md:col-4 text-800 mt-2">
          <Card className="text-center line-height-3 flex flex-column justify-content-center">
            <Skeleton className="w-10rem h-10rem mx-auto mb-2" />
            <div className="flex flex-column align-items-center gap-2">
              <Skeleton className="w-10rem" />
              <Skeleton className="w-8rem" />
            </div>
          </Card>

          <Card className="mt-2">
            <div className="flex align-items-center gap-2 mb-4">
              <Briefcase className="text-gray-500" />
              <Skeleton className="w-12rem" />
            </div>
            <div className="flex flex-column gap-2">
              <div className="flex align-items-center justify-content-between">
                <Skeleton className="w-10rem" />
                <Skeleton className="w-8rem" />
              </div>

              <div className="flex align-items-center justify-content-between">
                <Skeleton className="w-10rem" />
                <Skeleton className="w-8rem" />
              </div>

              <div className="flex align-items-center justify-content-between">
                <Skeleton className="w-10rem" />
                <Skeleton className="w-8rem" />
              </div>

              <div className="flex align-items-center justify-content-between">
                <Skeleton className="w-10rem" />
                <Skeleton className="w-8rem" />
              </div>

              <div className="flex align-items-center justify-content-between">
                <Skeleton className="w-10rem" />
                <Skeleton className="w-8rem" />
              </div>

              <div className="flex align-items-center justify-content-between">
                <Skeleton className="w-10rem" />
                <Skeleton className="w-8rem" />
              </div>
            </div>
          </Card>
        </div>

        {/* separator */}
        <div className="col-0 md:col-0" />

        {/* employee identity */}
        <Card className="col-12 md:col-8 mt-2">
          <div className="flex align-items-center gap-2 mb-4">
            <User className="text-gray-500" />
            <Skeleton className="w-10rem" />
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>
          </div>

          <hr className="border-1 border-400" />
          <div className="flex align-items-center gap-2 mt-2 mb-4">
            <Phone className="text-gray-500" />
            <Skeleton className="w-10rem mb-2" />
          </div>
          <div className="grid line-height-3">
            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>
          </div>

          <hr className="border-1 border-400" />
          <div className="flex align-items-center gap-2 mt-2 mb-4">
            <IdCard className="text-gray-500" />
            <Skeleton className="w-10rem mb-2" />
          </div>
          <div className="grid line-height-3">
            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>

            <div className="col-12 md:col-6">
              <Skeleton className="w-10rem mb-2" />
              <Skeleton className="w-8rem" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
