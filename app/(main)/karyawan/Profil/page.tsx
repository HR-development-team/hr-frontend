"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Skeleton } from "primereact/skeleton";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { classNames } from "primereact/utils"; // Import classNames untuk styling kondisional
import { useAuth } from "@/components/AuthContext";

// --- Interfaces (TETAP SAMA) ---
interface UserProfile {
	id: number;
	first_name: string;
	last_name: string;
	contact_phone: string;
	address: string;
	join_date: string;
	position_id: number;
	email?: string;
	position_name?: string;
	department_name?: string;
	profile_image_url?: string | null;
}

interface UserData {
	id: number;
	email: string;
	role: string;
	employee_id: number;
}

const API_PROFILE_URL = "/api/karyawan/profile";
const API_USER_URL = "/api/karyawan/user";

export default function ProfilPage() {
	const toast = useRef<Toast>(null);
	const { user } = useAuth();

	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({ contact_phone: "", address: "" });
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileUploadRef = useRef<FileUpload>(null);

	// --- 1. Ambil Data Profil (LOGIKA SAMA) ---
	useEffect(() => {
		const loadProfileData = async () => {
			setIsLoading(true);
			try {
				const [profileRes, userRes] = await Promise.all([
					fetch(API_PROFILE_URL),
					fetch(API_USER_URL),
				]);

				const profileJson = await profileRes.json();
				const userJson = await userRes.json();

				if (!profileRes.ok) {
					throw new Error(profileJson.message || "Gagal memuat data profil.");
				}
				if (!userRes.ok) {
					throw new Error(userJson.message || "Gagal memuat data user.");
				}

				const profileData: UserProfile = profileJson.users;
				const allUsers: UserData[] = userJson.users;

				if (!profileData) {
					throw new Error("Data profil karyawan tidak ditemukan.");
				}

				const userMatch = allUsers.find(
					(u) => u.employee_id === profileData.id
				);

				const mergedProfile: UserProfile = {
					...profileData,
					email: userMatch ? userMatch.email : "Email tidak terdaftar",
					position_name: profileData.position_name || "Belum ditentukan",
					department_name: profileData.department_name || "Belum ditentukan",
					profile_image_url: profileData.profile_image_url || null,
				};

				setProfile(mergedProfile);
				setFormData({
					contact_phone: mergedProfile.contact_phone,
					address: mergedProfile.address,
				});
			} catch (err: any) {
				console.error(err);
				toast.current?.show({
					severity: "error",
					summary: "Error",
					detail: err.message || "Gagal memuat profil",
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadProfileData();
	}, []);

	// --- 2. Fungsi Edit / Batal (LOGIKA SAMA) ---
	const handleEdit = () => {
		setIsEditMode(true);
		setImagePreview(null);
		setSelectedFile(null);
	};

	const handleCancel = () => {
		if (profile) {
			setFormData({
				contact_phone: profile.contact_phone,
				address: profile.address,
			});
		}
		setIsEditMode(false);
		setImagePreview(null);
		setSelectedFile(null);
		fileUploadRef.current?.clear();
	};

	const handleFileSelect = (e: FileUploadSelectEvent) => {
		const file = e.files[0];
		if (file) {
			setSelectedFile(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	// --- 3. Simpan Profil (LOGIKA SAMA) ---
	const handleSave = async () => {
		if (!profile) return;
		setIsSubmitting(true);

		try {
			const dataToSave = new FormData();
			dataToSave.append("contact_phone", formData.contact_phone);
			dataToSave.append("address", formData.address);
			if (selectedFile) {
				dataToSave.append("profile_image", selectedFile);
			}

			const res = await fetch(API_PROFILE_URL, {
				method: "PUT",
				body: dataToSave,
			});

			const result = await res.json();
			if (!res.ok)
				throw new Error(result.message || "Gagal memperbarui profil.");

			toast.current?.show({
				severity: "success",
				summary: "Sukses",
				detail: "Profil berhasil diperbarui",
			});

			const updatedProfileFromServer = result.updatedUser;
			const finalUpdatedProfile = { ...profile, ...updatedProfileFromServer };

			setProfile(finalUpdatedProfile);
			setFormData({
				contact_phone: finalUpdatedProfile.contact_phone,
				address: finalUpdatedProfile.address,
			});

			setIsEditMode(false);
			setImagePreview(null);
			setSelectedFile(null);
			fileUploadRef.current?.clear();
		} catch (err: any) {
			console.error(err);
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: err.message || "Terjadi kesalahan saat menyimpan profil",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// --- 4. Format Tanggal (LOGIKA SAMA) ---
	const formatJoinDate = (dateString: string) => {
		if (!dateString) return "";
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	// --- 5. UI Skeleton (Loading State) ---
	// Penyesuaian kecil pada kelas untuk mencocokkan layout baru
	if (isLoading) {
		return (
			<div className="grid p-fluid">
				<div className="col-12 lg:col-4">
					<Card className="shadow-2 mb-4 h-full flex flex-column">
						<div className="flex flex-column align-items-center mb-4">
							<Skeleton shape="circle" size="8rem" className="mb-3"></Skeleton>
							<Skeleton width="10rem" height="2rem" className="mb-2"></Skeleton>
							<Skeleton width="8rem" height="1.2rem"></Skeleton>
						</div>
						<Divider />
						<div className="flex-1 flex flex-column gap-2">
							<Skeleton width="80%" height="1.2rem" />
							<Skeleton width="70%" height="1.2rem" />
							<Skeleton width="90%" height="1.2rem" />
							<Skeleton width="60%" height="1.2rem" />
						</div>
					</Card>
				</div>
				<div className="col-12 lg:col-8">
					<Card className="shadow-2 h-full">
						<Skeleton height="400px"></Skeleton>
					</Card>
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex justify-content-center align-items-center h-screen">
				<Card title="Error">Gagal memuat profil. Silakan coba lagi.</Card>
			</div>
		);
	}

	// === 6. UI UTAMA (TAMPILAN MODERN) ===
	return (
		<div className="grid p-fluid">
			<Toast ref={toast} />

			{/* Kolom Kiri: Kartu Profil & Avatar */}
			<div className="col-12 lg:col-4">
				<Card className="profile-summary-card shadow-2 h-full flex flex-column">
					<div className="flex flex-column align-items-center text-center p-4">
						<Avatar
							image={imagePreview || profile.profile_image_url || undefined}
							label={
								!imagePreview && !profile.profile_image_url
									? `${user?.full_name[0] || ""}${
											user?.full_name[0] || ""
									  }`.toUpperCase()
									: undefined
							}
							shape="circle"
							className="p-overlay-badge p-avatar-info mb-4"
							style={{
								width: "12rem",
								height: "12rem",
								fontSize: "4rem",
								border: "4px solid var(--primary-color)",
							}}
						/>
						<h2 className="m-0 text-3xl font-bold text-color-primary">
							{user?.full_name}
						</h2>
						<p className="text-color-secondary mt-2 text-xl">
							{user?.position_name}
						</p>
						<span className="text-500 text-sm mt-1">
							{user?.department_name}
						</span>
					</div>

					<Divider align="center" type="dashed">
						<b>Kontak Cepat</b>
					</Divider>

					<div className="flex flex-column gap-3 p-4">
						<div className="flex align-items-center">
							<i className="pi pi-envelope mr-3 text-xl text-primary-500" />
							<span className="text-lg">{user?.email}</span>
						</div>
						<div className="flex align-items-center">
							<i className="pi pi-phone mr-3 text-xl text-primary-500" />
							<span className="text-lg">{user?.contact_phone}</span>
						</div>
						<div className="flex align-items-start">
							<i
								className="pi pi-home mr-3 text-xl text-primary-500"
								style={{ marginTop: "0.2rem" }}
							/>
							<span className="text-lg">{user?.address}</span>
						</div>
					</div>
				</Card>
			</div>

			{/* Kolom Kanan: Detail & Informasi Pekerjaan (TabView) */}
			<div className="col-12 lg:col-8">
				<TabView scrollable className="shadow-2 h-full">
					{/* Tab 1: Detail Profil */}
					<TabPanel header="Detail Profil" leftIcon="pi pi-user mr-2">
						<Card className="border-none shadow-none">
							{" "}
							{/* Hapus border/shadow card internal */}
							<div className="flex justify-content-end gap-2 mb-4">
								{!isEditMode ? (
									<Button
										label="Edit Profil"
										icon="pi pi-user-edit"
										className="p-button-outlined p-button-info"
										onClick={handleEdit}
									/>
								) : (
									<>
										<Button
											label="Batal"
											icon="pi pi-times"
											className="p-button-text p-button-secondary"
											onClick={handleCancel}
											disabled={isSubmitting}
										/>
										<Button
											label="Simpan Perubahan"
											icon="pi pi-check"
											className="p-button-success"
											onClick={handleSave}
											loading={isSubmitting}
										/>
									</>
								)}
							</div>
							<div className="p-fluid grid formgrid">
								{" "}
								{/* Gunakan formgrid */}
								{isEditMode && (
									<>
										<div className="field col-12">
											<label
												htmlFor="upload"
												className="font-semibold block mb-2"
											>
												<i className="pi pi-image mr-2" /> Ubah Foto Profil
											</label>
											<FileUpload
												ref={fileUploadRef}
												name="profile_pic"
												mode="advanced"
												accept="image/*"
												maxFileSize={2000000}
												auto={false}
												customUpload={true}
												onSelect={handleFileSelect}
												chooseLabel="Pilih Foto"
												cancelLabel="Hapus"
												emptyTemplate={
													<p className="m-0 text-500">
														Seret dan lepas gambar di sini atau pilih untuk
														mengunggah.
													</p>
												}
												headerTemplate={(options) => (
													<div className="flex flex-column md:flex-row align-items-center justify-content-between p-3 surface-overlay border-bottom-1 surface-border">
														<span className="text-lg font-semibold mb-2 md:mb-0">
															Pilih Foto Profil Baru
														</span>
														<div className="flex gap-2">
															{options.chooseButton}
															{options.cancelButton}
														</div>
													</div>
												)}
											/>
										</div>
										<div className="col-12">
											<Divider />
										</div>
									</>
								)}
								{/* Field Nama (Read-only) */}
								<div className="field col-12 md:col-6">
									<label
										htmlFor="firstname"
										className="font-semibold block mb-2"
									>
										<i className="pi pi-user mr-2 text-primary-500" /> Nama
										Depan
									</label>
									<InputText
										id="firstname"
										value={profile.first_name}
										readOnly
										disabled
										className="p-inputtext-sm"
									/>
								</div>
								<div className="field col-12 md:col-6">
									<label
										htmlFor="lastname"
										className="font-semibold block mb-2"
									>
										<i className="pi pi-user mr-2 text-primary-500" /> Nama
										Belakang
									</label>
									<InputText
										id="lastname"
										value={profile.last_name}
										readOnly
										disabled
										className="p-inputtext-sm"
									/>
								</div>
								{/* Field yang Bisa Diedit */}
								<div className="field col-12 md:col-6">
									<label htmlFor="phone" className="font-semibold block mb-2">
										<i className="pi pi-phone mr-2 text-primary-500" /> No.
										Telepon Kontak
									</label>
									<InputText
										id="phone"
										value={
											isEditMode
												? formData.contact_phone
												: profile.contact_phone
										}
										onChange={(e) =>
											setFormData({
												...formData,
												contact_phone: e.target.value,
											})
										}
										readOnly={!isEditMode}
										disabled={!isEditMode}
										className={classNames({
											"p-inputtext-sm": true,
											"p-invalid": !formData.contact_phone && isEditMode,
										})}
									/>
									{isEditMode && !formData.contact_phone && (
										<small className="p-error">
											Nomor telepon wajib diisi.
										</small>
									)}
								</div>
								<div className="field col-12">
									<label htmlFor="address" className="font-semibold block mb-2">
										<i className="pi pi-home mr-2 text-primary-500" /> Alamat
									</label>
									<InputTextarea
										id="address"
										value={isEditMode ? formData.address : profile.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
										readOnly={!isEditMode}
										disabled={!isEditMode}
										rows={4}
										autoResize
										className={classNames({
											"p-inputtext-sm": true,
											"p-invalid": !formData.address && isEditMode,
										})}
									/>
									{isEditMode && !formData.address && (
										<small className="p-error">Alamat wajib diisi.</small>
									)}
								</div>
							</div>
						</Card>
					</TabPanel>

					{/* Tab 2: Informasi Pekerjaan */}
					<TabPanel
						header="Informasi Pekerjaan"
						leftIcon="pi pi-briefcase mr-2"
					>
						<Card className="border-none shadow-none">
							<div className="p-3">
								<div className="flex flex-column gap-4">
									<div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
										<span className="font-semibold text-lg flex align-items-center">
											<i className="pi pi-envelope mr-3 text-xl text-primary-500" />{" "}
											Email
										</span>
										<span className="text-color-secondary text-lg md:text-right">
											{profile.email || "Tidak ada email"}
										</span>
									</div>
									<Divider className="my-1" />

									<div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
										<span className="font-semibold text-lg flex align-items-center">
											<i className="pi pi-id-card mr-3 text-xl text-primary-500" />{" "}
											Posisi / Jabatan
										</span>
										<span className="text-color-secondary text-lg md:text-right">
											{profile.position_name}
										</span>
									</div>
									<Divider className="my-1" />

									<div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
										<span className="font-semibold text-lg flex align-items-center">
											<i className="pi pi-sitemap mr-3 text-xl text-primary-500" />{" "}
											Departemen
										</span>
										<span className="text-color-secondary text-lg md:text-right">
											{profile.department_name}
										</span>
									</div>
									<Divider className="my-1" />

									<div className="flex flex-column md:flex-row md:justify-content-between align-items-start md:align-items-center">
										<span className="font-semibold text-lg flex align-items-center">
											<i className="pi pi-calendar-plus mr-3 text-xl text-primary-500" />{" "}
											Tanggal Bergabung
										</span>
										<span className="text-color-secondary text-lg">
											{formatJoinDate(profile.join_date)}
										</span>
									</div>
								</div>
							</div>
						</Card>
					</TabPanel>
				</TabView>
			</div>
		</div>
	);
}
