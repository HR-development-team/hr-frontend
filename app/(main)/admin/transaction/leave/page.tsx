"use client";

import { EmployeeData } from "@/lib/types/employee";
import { LeaveRequestData } from "@/lib/types/leaveRequest";
import { LeaveTypeData } from "@/lib/types/leaveType";
import { TicketsPlane } from "lucide-react";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import React, { useEffect, useMemo, useRef, useState } from "react";
import DataTableLeave from "./components/DataTableLeave";

interface CombinedLeaveRequestData extends LeaveRequestData {
	employee_name: string;
	leave_type_name: string;
}

export default function Leave() {
	const toasRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [employee, setEmployee] = useState<EmployeeData[]>([]);
	const [leaveType, setLeaveType] = useState<LeaveTypeData[]>([]);
	const [leaveRequest, setLeaveRequest] = useState<LeaveRequestData[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const featchAllData = async () => {
		setIsLoading(true);
		try {
			const [employeeRes, leaveTypeRes, leaveRequestRes] = await Promise.all([
				fetch("/api/admin/master/employee"),
				fetch("/api/admin/master/leave-type"),
				fetch("/api/admin/transaction/leave-request"),
			]);

			if (!employeeRes.ok || !leaveTypeRes.ok || !leaveRequestRes.ok) {
				throw new Error("Gagal mengambil data dari server");
			}

			const employeeData = await employeeRes.json();
			const leaveTypeData = await leaveTypeRes.json();
			const leaveRequestData = await leaveRequestRes.json();

			console.log(employeeData.message);

			if (
				employeeData &&
				leaveTypeData &&
				leaveRequestData &&
				employeeData.status === "00" &&
				leaveTypeData.status === "00" &&
				leaveRequestData.status === "00"
			) {
				if (isInitialLoad.current) {
					toasRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: leaveRequestData.message,
						life: 3000,
					});

					isInitialLoad.current = false;
				}

				setEmployee(employeeData.master_employees || []);
				setLeaveType(leaveTypeData.leave_types || []);
				setLeaveRequest(leaveRequestData.leave_requests || []);
			} else {
				toasRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail: leaveRequestData.message,
					life: 3000,
				});
				setEmployee([]);
				setLeaveType([]);
				setLeaveRequest([]);
			}
		} catch (error: any) {
			setEmployee([]);
			setLeaveType([]);
			setLeaveRequest([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		featchAllData();
	}, []);

	const employeeMap = useMemo(() => {
		const map = new Map<number, string>();
		employee.forEach((depth) => {
			map.set(depth.id, depth.first_name);
		});
		return map;
	}, [employee]);

	const leaveTypeMap = useMemo(() => {
		const map = new Map<number, string>();
		leaveType.forEach((depth) => {
			map.set(depth.id, depth.name);
		});
		return map;
	}, [leaveType]);

	const combinedLeaveRequestData: CombinedLeaveRequestData[] = useMemo(() => {
		if (!leaveRequest) {
			return [];
		}

		const mappedData = leaveRequest.map((request) => {
			const employeeName =
				employeeMap.get(request.employee_id) || "Karyawan tidak ditemukan";
			const leaveTypeName =
				leaveTypeMap.get(request.leave_type_id) || "Tipe Cuti tidak ditemukan";

			return {
				...request,
				employee_name: employeeName,
				leave_type_name: leaveTypeName,
			};
		});

		mappedData.sort((a, b) => {
			if (a.status === "Pending" && b.status !== "Pending") {
				return -1;
			}
			if (a.status === "Pending" && b.status === "Pending") {
				return 1;
			}

			return (
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
		});

		return mappedData;
	}, [leaveRequest, employeeMap, leaveTypeMap]);

	return (
		<div>
			<Toast ref={toasRef} />
			<div className="mb-6 flex align-items-center gap-3 mt-4">
				<div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
					<TicketsPlane className="w-2rem h-2rem" />
				</div>
				<div>
					<h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						Manajemen Cuti
					</h1>
					<p className="text-sm md:text-md text-gray-500">
						Kelola pengajuan cuti dan saldo cuti karyawan
					</p>
				</div>
			</div>

			<Card>
				<div className="flex flex-column gap-4">
					<div className="flex gap-2 align-items-center">
						<TicketsPlane className="h-2" />
						<h2 className="text-base text-800">Daftar Pengajuan Cuti</h2>
					</div>

					{/* total status */}

					<div className="flex align-items-center gap-4 text-white font-medium">
						{/* pending status */}
						<div className="bg-bluegray-500 py-2 px-3 border-round flex gap-2">
							<span>Pending:</span>
							<span>total</span>
						</div>

						{/* approve */}
						<div className="bg-green-500 py-2 px-3 border-round flex gap-2">
							<span>Approve:</span>
							<span>total</span>
						</div>

						{/* rejected */}
						<div className="bg-red-500 py-2 px-3 border-round flex gap-2">
							<span>Rejected:</span>
							<span>total</span>
						</div>
					</div>

					<DataTableLeave
						leaveRequest={combinedLeaveRequestData}
						isLoading={isLoading}
					/>
				</div>
			</Card>
		</div>
	);
}
