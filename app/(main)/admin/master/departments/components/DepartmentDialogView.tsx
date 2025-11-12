import { DepartmentViewProps } from "@/lib/types/view/departmentViewTypes";
import { Building } from "lucide-react";
import { Card } from "primereact/card";
import DepartmentDialogViewSkeleton from "./DepartmentDialogViewSkeleton";

export default function DepartmentDialogView({
	departmentData,
	isLoading,
	dialogMode,
}: DepartmentViewProps) {
	const isOnViewMode = dialogMode === "view" ? true : false;

    if (isLoading) {
        return <DepartmentDialogViewSkeleton />
    }
	return (
		<div className={`${isOnViewMode ? "text-800" : "hidden"}`}>
			<Card className="line-height-3">
				<div className="flex align-items-center gap-2 mb-4">
					<Building className="text-blue-500" />
					<span className="font-medium text-800">Detail Data Departemen</span>
				</div>
				<div className="grid">
					<div className="col-12 flex justify-content-between border-bottom-1 border-gray-400 py-4"> 
						<div className="text-base font-medium">
							<span className="text-500">ID Departemen</span>
							<p>
								{departmentData?.department_code
									? departmentData.department_code
									: "-"}
							</p>
						</div>

						<div className="text-base font-medium">
							<span className="text-500">Nama Departemen</span>
							<p>{departmentData?.name ? departmentData.name : "-"}</p>
						</div>
					</div>

					<div className="text-base font-medium col-12 p-3 bg-gray-100 border-round-xl mt-3">
						<span>Deskripsi Departemen</span>
						<p className="text-500">
							{departmentData?.description ? departmentData.description : "-"}
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
