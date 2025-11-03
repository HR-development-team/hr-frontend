import { Users } from "lucide-react";
import { Card } from "primereact/card";
import DataTableEmployees from "./components/DataTableEmployees";

export default function Employees() {
	return (
		<div>
			<div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
				<div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
					<Users className="w-2rem h-2rem" />
				</div>
				<div>
					<h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						Data Karyawan
					</h1>
					<p className="text-sm md:text-md text-gray-500">
						Kelola data diri dan informasi karyawan
					</p>
				</div>
			</div>

			<Card>
				<div className="flex flex-column gap-2">
					<h2 className="text-base text-800">Master Data Karyawan</h2>

					{/* filters */}
					<div></div>

					{/* data table */}
					<DataTableEmployees />
				</div>
			</Card>
		</div>
	);
}
