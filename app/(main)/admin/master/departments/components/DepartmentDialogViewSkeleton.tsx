import { DepartmentViewProps } from "@/lib/types/view/departmentViewTypes";
import { Building } from "lucide-react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function DepartmentDialogViewSkeleton() {
	return (
		<div>
			<Card>
				<div className="flex align-items-center gap-2 mb-4">
					<Building className="text-gray-500" />
					<Skeleton className="w-10rem" />
				</div>
				<div className="grid">
					<div className="col-12 flex justify-content-between border-bottom-1 border-gray-400 py-4">
						<div className="flex flex-column gap-2">
							<Skeleton className="w-10rem" />
							<Skeleton className="w-8rem" />
						</div>

						<div className="flex flex-column gap-2">
							<Skeleton className="w-10rem" />
							<Skeleton className="w-8rem" />
						</div>
					</div>

					<Skeleton className="w-full h-6rem mt-3" />
				</div>
			</Card>
		</div>
	);
}
