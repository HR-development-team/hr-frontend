// /app/page.tsx

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

interface UserProfile {
	first_name: string;
	last_name: string;
}

// --- Data Mock untuk simulasi ---
const mockStats: RingkasanStats = {
	totalHadir: 20,
	totalTidakHadir: 2,
	sisaCuti: 8,
};

const mockPending: PengajuanPending[] = [
	{ id: "C-001", jenis: "Cuti", tanggal: "28 Okt 2025", status: "Pending" },
	{ id: "L-002", jenis: "Lembur", tanggal: "25 Okt 2025", status: "Approved" },
	{ id: "C-004", jenis: "Cuti", tanggal: "29 Okt 2025", status: "Pending" },
];

// --- Endpoint API ---
const API_PROFILE_URL = "/api/karyawan/profile";

export default function DashboardRingkasanPage() {
	const toast = useRef<Toast>(null);
	const { user } = useAuth();

	const [stats, setStats] = useState<RingkasanStats | null>(null);
	const [pendingList, setPendingList] = useState<PengajuanPending[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// --- useEffect untuk memuat data ---
	useEffect(() => {
		const loadDashboardData = async () => {
			setIsLoading(true);
			try {
				// 🔹 Simulasi data statistik & pending (hapus nanti saat backend siap)
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setStats(mockStats);
				setPendingList(mockPending.filter((p) => p.status === "Pending"));
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
								<span className="text-color-secondary">Total Telat Hadir</span>
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
