"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import Link from "next/link";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { useAuth } from "@/components/AuthContext";

// --- Tipe Data ---
interface RingkasanStats {
	totalHadir: number;
	totalTidakHadir: number;
	sisaCuti: number;
}

interface PengajuanPending {
	id: string;
	jenis: "Cuti" | "Lembur";
	tanggal: string;
	status: "Pending" | "Approved" | "Rejected";
}

// --- [PERBAIKAN] Endpoint API ---
const API_URLS = {
	dashboard: "/api/karyawan/dashboard",
	leaveRequests: "/api/karyawan/leave-request"
};

// --- (Data Mock dihapus, kita akan fetch) ---
// const mockStats: RingkasanStats = { ... };
// const mockPending: PengajuanPending[] = [ ... ];


export default function DashboardRingkasanPage() {
	const toast = useRef<Toast>(null);
	const { user } = useAuth();

	const [stats, setStats] = useState<RingkasanStats | null>(null);
	const [pendingList, setPendingList] = useState<PengajuanPending[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// --- [PERBAIKAN] useEffect untuk memuat data dari API ---
	useEffect(() => {
		const loadDashboardData = async () => {
			setIsLoading(true);
			try {
				// Panggil kedua endpoint secara paralel
				const [resDashboard, resLeave] = await Promise.all([
					fetch(API_URLS.dashboard),
					fetch(API_URLS.leaveRequests)
				]);

				if (!resDashboard.ok) {
					throw new Error("Gagal memuat data statistik dashboard");
				}
				if (!resLeave.ok) {
					throw new Error("Gagal memuat data pengajuan cuti");
				}

				const dataDashboard = await resDashboard.json();
				const dataLeave = await resLeave.json();

				// 1. Proses Data Statistik (dari JSON Anda)
				if (dataDashboard.status === "00" && dataDashboard.master_employees) {
					setStats({
						totalHadir: dataDashboard.master_employees.totalAttendance,
						totalTidakHadir: dataDashboard.master_employees.totalNotAttend,
						// TODO: API dasbor tidak menyediakan sisa cuti.
						// Ganti angka '8' ini jika Anda punya API untuk sisa cuti.
						sisaCuti: 8, 
					});
				} else {
					throw new Error(dataDashboard.message || "Data statistik tidak valid");
				}

				// 2. Proses Data Pengajuan Pending (dari API Cuti)
				if (dataLeave.status === "00" && Array.isArray(dataLeave.leave_requests)) {
					const pending = dataLeave.leave_requests
						.filter((p: any) => p.status === "Pending")
						.map((p: any): PengajuanPending => ({
							id: p.id,
							jenis: "Cuti", // Asumsi, karena hanya ada data cuti
							tanggal: new Date(p.created_at).toLocaleDateString("id-ID", {
								day: 'numeric',
								month: 'short',
								year: 'numeric'
							}),
							status: "Pending"
						}));
					setPendingList(pending);
				} else {
					throw new Error(dataLeave.message || "Data pengajuan tidak valid");
				}

			} catch (error) {
				console.error(error);
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: (error as Error).message || "Gagal memuat data dashboard",
					life: 3000,
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadDashboardData();
	}, []);
	// --- [BATAS PERBAIKAN] ---


	// --- Template status untuk tabel ---
	const statusBodyTemplate = (rowData: PengajuanPending) => {
		const severityMap: { [key: string]: "warning" | "success" | "danger" } = {
			Pending: "warning",
			Approved: "success",
			Rejected: "danger",
		};
		return (
			<Tag value={rowData.status} severity={severityMap[rowData.status]} />
		);
	};

	// --- Loading Skeleton ---
	if (isLoading) {
		return (
			<div>
				<div className="mb-4">
					<Skeleton width="20rem" height="2.5rem" className="mb-2"></Skeleton>
					<Skeleton width="15rem" height="1.5rem"></Skeleton>
				</div>
				<Divider className="mb-4" />
				<div className="grid">
					{[1, 2, 3].map((i) => (
						<div key={i} className="col-12 md:col-4">
							<Card className="shadow-1 h-full">
								<div className="flex align-items-center">
									<Skeleton
										shape="circle"
										size="3rem"
										className="mr-3"
									></Skeleton>
									<div>
										<Skeleton
											width="10rem"
											height="1rem"
											className="mb-2"
										></Skeleton>
										<Skeleton width="5rem" height="1.5rem"></Skeleton>
									</div>
								</div>
							</Card>
						</div>
					))}
				</div>
				<div className="grid mt-3">
					<div className="col-12 lg:col-8">
						<Panel header="Memuat Pengajuan...">
							<Skeleton height="150px"></Skeleton>
						</Panel>
					</div>
					<div className="col-12 lg:col-4">
						<Panel header="Memuat Akses Cepat...">
							<Skeleton height="150px"></Skeleton>
						</Panel>
					</div>
				</div>
			</div>
		);
	}

	// --- Jika data gagal ---
	// [PERBAIKAN] Skeleton akan menangani 'isLoading', kita cek 'stats' setelahnya
	if (!stats) {
		return (
			<div>
				<Toast ref={toast} />
				<Card title="Gagal Memuat Data">
					<p>
						Terjadi kesalahan saat mengambil data dashboard. Silakan coba muat
						ulang halaman.
					</p>
				</Card>
			</div>
		);
	}

	// --- Tampilan Utama ---
	return (
		<div>
			<Toast ref={toast} />

			{/* Header Sambutan */}
			<div className="mb-4">
				<h2 className="m-0 text-4xl font-bold text-900">
					{user ? `Selamat Datang, ${user.full_name}` : "Selamat Datang"}
				</h2>
				<p className="text-color-secondary text-lg">
					Berikut adalah ringkasan aktivitas Anda hari ini.
				</p>
			</div>
			<Divider className="mb-4" />

			{/* Ringkasan Absensi */}
			<div className="grid">
				<div className="col-12 md:col-4">
					<Card className="shadow-1 h-full hover:shadow-4 transition-duration-200 cursor-pointer">
						<div className="flex align-items-center">
							<i className="pi pi-check-circle text-3xl text-green-500 mr-3"></i>
							<div>
								<span className="text-color-secondary">
									Total Hadir Bulan Ini
								</span>
								<h3 className="m-0 mt-1">{stats.totalHadir} Hari</h3>
							</div>
						</div>
					</Card>
				</div>
				<div className="col-12 md:col-4">
					<Card className="shadow-1 h-full hover:shadow-4 transition-duration-200 cursor-pointer">
						<div className="flex align-items-center">
							<i className="pi pi-exclamation-triangle text-3xl text-orange-500 mr-3"></i>
							<div>
								<span className="text-color-secondary">Total Tidak Hadir</span>
								<h3 className="m-0 mt-1">{stats.totalTidakHadir} Hari</h3>
							</div>
						</div>
					</Card>
				</div>
				<div className="col-12 md:col-4">
					<Card className="shadow-1 h-full hover:shadow-4 transition-duration-200 cursor-pointer">
						<div className="flex align-items-center">
							<i className="pi pi-calendar text-3xl text-blue-500 mr-3"></i>
							<div>
								<span className="text-color-secondary">Sisa Cuti Tahunan</span>
								<h3 className="m-0 mt-1">{stats.sisaCuti} Hari</h3>
							</div>
						</div>
					</Card>
				</div>
			</div>

			{/* Ringkasan Menu */}
			<div className="grid mt-3">
				<div className="col-12 lg:col-8">
					<Panel header="Ringkasan Pengajuan (Tertunda)">
						{pendingList.length > 0 ? (
							<DataTable
								value={pendingList}
								responsiveLayout="stack"
								size="small"
							>
								<Column field="jenis" header="Jenis Pengajuan" />
								<Column field="tanggal" header="Tanggal Diajukan" />
								<Column header="Status" body={statusBodyTemplate} />
							</DataTable>
						) : (
							<p className="m-0">
								Tidak ada pengajuan yang tertunda. Kerja bagus!
							</p>
						)}
					</Panel>
				</div>

				<div className="col-12 lg:col-4">
					<Panel header="Akses Cepat">
						<div className="flex flex-column gap-3">
							<Link href="/karyawan/Absensi" passHref>
								<Button
									label="Lakukan Absensi"
									icon="pi pi-clock"
									className="w-full p-button-success p-button-raised"
								/>
							</Link>
							<Link href="/karyawan/Pengajuan/cuti" passHref>
								<Button
									label="Buat Pengajuan Baru"
									icon="pi pi-file-edit"
									className="w-full"
									outlined
								/>
							</Link>
							<Link href="/karyawan/Profil" passHref>
								<Button
									label="Lihat Profil Saya"
									icon="pi pi-user"
									className="w-full p-button-secondary"
									outlined
								/>
							</Link>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	);
}