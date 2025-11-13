"use client"; // WAJIB: Menandakan ini adalah Client Component untuk Next.js

import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataView } from 'primereact/dataview';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// --- BAGIAN 1: TIPE DATA & ENDPOINT API ---

// [FIX 1] Sesuaikan Interface dengan JSON dari API
interface Session {
	id: string | number;
	name: string;
	// Ganti start_time -> open_time dan end_time -> close_time
	open_time?: string; // cth: "14:59:00"
	close_time?: string;   // cth: "20:00:00"
}

interface HistoryItem {
	status: string;
	time: string;
}

interface AttendanceStatus {
	id: string | null;
	isCheckedIn: boolean;
	checkInTime: string | null; // ISO Date String
	checkOutTime: string | null; // ISO Date String
	history: HistoryItem[];
}

type AttendanceStatusType = 'Hadir' | 'Terlambat' | 'Absen';

interface DailyHistoryItem {
	id: string;
	date: string;
	checkIn: string | null;
	checkOut: string | null;
	status: AttendanceStatusType;
}

// --- PERUBAHAN 1: Sederhanakan API_URLS ---
const API_URLS = {
	// getCurrentStatus: '/api/karyawan/attendances/me', // Dihapus, digabung ke getAttendanceData
	getAttendanceData: '/api/karyawan/attendances', // Menggantikan getHistory
	checkIn: '/api/karyawan/attendances/check-in',
	checkOut: '/api/karyawan/attendances/check-out',
	getAllSessions: '/api/karyawan/attendance-sessions', 
};

// --- [FIX 2] Sesuaikan helper dengan Interface baru ---
const findActiveSession = (sessions: Session[]): Session | null => {
	const now = new Date(); // Waktu saat ini

	for (const session of sessions) {
		// Ganti session.start_time -> session.open_time
		if (!session.open_time || !session.close_time) continue;

		// Asumsi format 'HH:mm:ss'
		try {
			const [startH, startM, startS] = session.open_time.split(':').map(Number);
			const [endH, endM, endS] = session.close_time.split(':').map(Number);

			const startTime = new Date();
			startTime.setHours(startH, startM, startS, 0);

			const endTime = new Date();
			endTime.setHours(endH, endM, endS, 0);

			if (now >= startTime && now <= endTime) {
				return session; // Ditemukan sesi yang aktif!
			}
		} catch (e) {
			console.error("Error parsing session time:", session, e);
		}
	}
	return null; // Tidak ada sesi aktif
};


// --- BAGIAN 2: KOMPONEN REACT (TSX) ---

export default function AttendancePage() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [activeSession, setActiveSession] = useState<Session | null>(null);
	const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
		id: null, isCheckedIn: false, checkInTime: null, checkOutTime: null, history: []
	});
	const [history, setHistory] = useState<DailyHistoryItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const toast = useRef<Toast>(null);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		fetchInitialData();
	}, []);

	const showErrorToast = (message: string) => {
		toast.current?.show({ severity: 'error', summary: 'Error', detail: message });
	};

	// --- [PERUBAHAN 2: Perbarui fetchInitialData] ---
	// Sekarang hanya memanggil 2 API (bukan 3)
	const fetchInitialData = async () => {
		setIsLoading(true);
		try {
			// 1. Panggil 2 endpoint API secara paralel
			const [resAttendance, resSessions] = await Promise.all([
				// fetch(API_URLS.getCurrentStatus), // Dihapus
				fetch(API_URLS.getAttendanceData), // Panggil endpoint gabungan
				fetch(API_URLS.getAllSessions) 
			]);

			// 2. Cek jika ada respons yang gagal
			if (!resAttendance.ok || !resSessions.ok) {
				console.error("Salah satu API gagal:", { resAttendance, resSessions });
				throw new Error('Gagal mengambil data dari server');
			}

			// 3. Parse semua JSON
			const dataAttendance = await resAttendance.json(); // Data gabungan (status + riwayat)
			const dataSessions = await resSessions.json();
			
			// 4. Proses Sesi Aktif
			// (Logika ini tidak berubah)
			if (dataSessions.status === '00' && Array.isArray(dataSessions['attendance-sessions'])) {
				const active = findActiveSession(dataSessions['attendance-sessions']);
				setActiveSession(active); 
			} else {
				setActiveSession(null);
			}

			// 5. Proses Status Hari Ini
			// (Gunakan dataAttendance, asumsi berisi properti "attendance")
			if (dataAttendance.status === '00' && dataAttendance.attendance) {
				const apiStatus = dataAttendance.attendance;
				const history: HistoryItem[] = [];
				if (apiStatus.check_in_time) history.push({ status: 'Check In', time: format(new Date(apiStatus.check_in_time), 'HH:mm:ss') });
				if (apiStatus.check_out_time) history.push({ status: 'Check Out', time: format(new Date(apiStatus.check_out_time), 'HH:mm:ss') });

				setAttendanceStatus({
					id: apiStatus.id,
					isCheckedIn: !!apiStatus.check_in_time && !apiStatus.check_out_time,
					checkInTime: apiStatus.check_in_time,
					checkOutTime: apiStatus.check_out_time,
					history: history
				});
			} else {
				setAttendanceStatus({ id: null, isCheckedIn: false, checkInTime: null, checkOutTime: null, history: [] });
			}
			
			// 6. Proses Riwayat Absensi
			// (Gunakan dataAttendance, asumsi berisi properti "attendances")
			if (dataAttendance.status === '00' && Array.isArray(dataAttendance.attendances)) {
				const mappedHistory = dataAttendance.attendances.map((item: any): DailyHistoryItem => {
					let status: AttendanceStatusType = 'Absen';
					// Sesuaikan 'Present' dan 'Late' jika API Anda mengirim status yang berbeda
					if (item.status === 'Present') status = 'Hadir';
					else if (item.status === 'Late') status = 'Terlambat';
					
					return {
						id: item.id,
						date: format(new Date(item.date), 'EEEE, dd MMMM yyyy', { locale: id }),
						checkIn: item.check_in ? format(new Date(item.check_in), 'HH:mm:ss') : null,
						checkOut: item.check_out ? format(new Date(item.check_out), 'HH:mm:ss') : null,
						status: status
					};
				});
				setHistory(mappedHistory);
			}

		} catch (error: unknown) {
			console.error("Error fetching data:", error);
			showErrorToast('Gagal memuat data absensi');
		} finally {
			setIsLoading(false);
		}
	};

	// --- (Sisa kode tidak berubah, semua sudah benar) ---
	const handleCheckIn = async () => {
		if (!activeSession) {
			showErrorToast('Tidak ada sesi absensi yang aktif saat ini.');
			return; 
		}
		setIsSubmitting(true);
		try {
			// Kirim ID sesi di dalam body
			const payload = {
				session_id: activeSession.id, 
			};

			const res = await fetch(API_URLS.checkIn, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			
			const data = await res.json();

			if (!res.ok || data.status !== '00') {
				// Tangkap error dari API (misal: "Sudah check-in")
				throw new Error(data.message || 'Gagal melakukan Check In');
			}
			
			toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: data.message || 'Anda berhasil Check In' });
			await fetchInitialData(); // Muat ulang semua data
		} catch (error: any) {
			console.error("Error Check In:", error);
			showErrorToast(error.message || 'Gagal melakukan Check In');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCheckOut = async () => {
		if (!attendanceStatus.id) return;
		setIsSubmitting(true);
		try {
			const payload = {
				attendance_id: attendanceStatus.id
			};

			const res = await fetch(API_URLS.checkOut, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (!res.ok || data.status !== '00') {
				throw new Error(data.message || 'Gagal melakukan Check Out');
			}

			toast.current?.show({ severity: 'success', summary: 'Berhasil', detail: data.message || 'Anda berhasil Check Out' });
			await fetchInitialData(); 
		} catch (error: any)
		{
			console.error("Error Check Out:", error);
			showErrorToast(error.message || 'Gagal melakukan Check Out');
		} finally {
			setIsSubmitting(false);
		}
	};

	const formattedTime = format(currentTime, 'HH:mm:ss');
	const formattedDate = format(currentTime, 'EEEE, dd MMMM yyyy', { locale: id });
	const isButtonDisabled = isLoading || isSubmitting || !activeSession || !!attendanceStatus.checkOutTime;

	const cardTitle = (
		<div className="flex justify-content-between align-items-center">
			<span>Absensi Karyawan</span>
			{!isLoading && (
				<Tag
					value={activeSession ? 'Sesi Aktif' : 'Sesi Tidak Aktif'}
					severity={activeSession ? 'success' : 'danger'}
				/>
			)}
		</div>
	);

	const cardSubtitle = (
		<span>
			{activeSession ? activeSession.name : (isLoading ? 'Memuat sesi...' : 'Tidak ada sesi absensi yang aktif.')}
		</span>
	);
	
	const getHistorySeverity = (status: AttendanceStatusType) => {
		switch (status) {
			case 'Hadir': return 'success';
			case 'Terlambat': return 'warning';
			case 'Absen': return 'danger';
			default: return 'info';
		}
	};

	const historyItemTemplate = (item: DailyHistoryItem) => {
		return (
			<div className="col-12 p-3">
				<div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3"
					style={{ borderBottom: '1px solid var(--surface-d)', paddingBottom: '1rem' }}>
					
					<div className="flex flex-column gap-1">
						<div className="text-lg font-bold">{item.date}</div>
						<Tag value={item.status} severity={getHistorySeverity(item.status)} style={{ width: 'fit-content' }} />
					</div>
					
					<div className="flex flex-row md:flex-column md:align-items-end gap-3 md:gap-1">
						<span className="text-md font-medium text-green-600">
							<i className="pi pi-sign-in mr-2" />{item.checkIn || 'N/A'}
						</span>
						<span className="text-md font-medium text-red-600">
							<i className="pi pi-sign-out mr-2" />{item.checkOut || 'N/A'}
						</span>
					</div>

				</div>
			</div>
		);
	};

	// --- TAMPILAN JSX (RENDER) ---
	return (
		<div className="grid grid-nogutter justify-content-center p-4" style={{ minHeight: '90vh', background: '#f4f4f4' }}>
			<Toast ref={toast} />
			{/* --- [PERUBAHAN UKURAN] --- */}
			{/* Diubah menjadi full-width (12) untuk medium dan large screen */}
			<div className="col-12 md:col-12 lg:col-12"> 
				
				<Card title={cardTitle} subTitle={cardSubtitle} className="shadow-5">
					
					{/* Area Jam dan Tombol Aksi */}
					<div className="text-center p-4">
						<div className="mb-4">
							<div className="text-6xl font-bold text-primary">{formattedTime}</div>
							<div className="text-xl text-color-secondary">{formattedDate}</div>
						</div>

						{attendanceStatus.isCheckedIn && !attendanceStatus.checkOutTime && attendanceStatus.checkInTime && (
							<div className="mb-4">
								<Tag className="p-3" severity="success"
									value={`Checked In @ ${format(new Date(attendanceStatus.checkInTime), 'HH:mm:ss')}`}
									icon="pi pi-check-circle" />
							</div>
						)}

						{!attendanceStatus.isCheckedIn ? (
							<Button label="Check In" icon="pi pi-sign-in"
									className="p-button-success p-button-lg p-button-raised w-full md:w-auto"
									onClick={handleCheckIn} loading={isSubmitting} disabled={isButtonDisabled} />
						) : (
							<Button label="Check Out" icon="pi pi-sign-out"
									className="p-button-danger p-button-lg p-button-raised w-full md:w-auto"
									onClick={handleCheckOut} loading={isSubmitting} disabled={isButtonDisabled} />
						)}
						
						{attendanceStatus.checkOutTime && (
								<Tag className="mt-4" severity="info" value="Anda sudah menyelesaikan absensi hari ini." />
						)}
						
						{!activeSession && !isLoading && (
								<Tag className="mt-4" severity="warning" value="Tidak ada sesi absensi yang aktif saat ini." />
						)}
					</div>

					{/* (Sisa TabView dan TabPanel tidak berubah) */}
					<TabView>
						<TabPanel header="Hari Ini">
							<div className="px-1 py-3">
								{attendanceStatus.history.length > 0 ? (
									<Timeline
										value={attendanceStatus.history}
										align="alternate"
										className="custom-timeline"
										content={(item: HistoryItem) => ( 
											<>
												<strong className={item.status === 'Check Out' ? 'text-red-500' : 'text-blue-500'}>
													{item.status}
												</strong>
												<div className="text-sm text-color-secondary">{item.time}</div>
											</>
										)}
									/>
								) : (
									<div className="text-center text-color-secondary">
										<i className="pi pi-info-circle mr-2" />
										Belum ada riwayat check-in/out hari ini.
									</div>
								)}
							</div>
						</TabPanel>
						
						<TabPanel header="Riwayat Sebelumnya">
							<DataView
								value={history}
								itemTemplate={historyItemTemplate}
								loading={isLoading}
								layout="list"
								emptyMessage="Tidak ada riwayat absensi sebelumnya."
							/>
						</TabPanel>
					</TabView>

				</Card>
			</div>
		</div>
	);
}