import { User } from "lucide-react";
import { Card } from "primereact/card";
import { formatDateIDN } from "@/lib/utils/dateFormat";
import { UserViewProps } from "@/lib/types/view/userViewPropsTypes";
import UserDialogViewSkeleton from "./UserDialogViewSkeleton";
import { ViewMasterPropsTypes } from "@/lib/types/view/viewMasterPropsTypes";
import { GetUserByIdData } from "@/lib/types/user";

export default function UserDialogView({
  data,
  isLoading,
  dialogMode,
}: ViewMasterPropsTypes<GetUserByIdData>) {
  const isOnViewMode = dialogMode === "view" ? true : false;

  const role = data?.role === "admin" ? "Admin" : "Karyawan";

  // isLoading = true;

  if (isLoading) {
    return <UserDialogViewSkeleton />;
  }

  return (
    <div className={`${isOnViewMode ? "text-800" : "hidden"}`}>
      <Card className="line-height-3">
        <div className="flex align-items-center gap-2 mb-4">
          <User className="text-blue-500" />
          <span className="font-medium text-800">Detail User</span>
        </div>
        <div className="grid">
          <div className="col-12 flex justify-content-between gap-4 border-bottom-1 border-gray-400 py-4">
            <div className="text-base font-medium">
              <span className="text-500">Email User</span>
              <p>{data?.email ? data.email : "-"}</p>
              <p className="font-light font-italic">
                {data?.user_code ? data.user_code : "-"}
              </p>
            </div>

            <div className="text-base font-medium flex-1">
              <span className="text-500">Role User</span>
              <p>{data?.role ? role : "Belum diberi role"}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-column xl:flex-row xl:align-items-center justify-content-between font-italic text-xs">
          <div className="font-light flex align-items-center gap-2 text-500">
            <span className="">Diperbarui:</span>
            <span>{formatDateIDN(data?.updated_at)}</span>
          </div>

          <div className="font-light flex align-items-center gap-2 text-500">
            <span className="">Ditambahkan:</span>
            <span>{formatDateIDN(data?.created_at)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
