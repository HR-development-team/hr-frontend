"use client";

import { LoginFormData, loginFormSchema } from "@/lib/schemas/loginFormSchema";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";

const defaultValues: LoginFormData = {
	email: "",
	password: "",
};

export default function Home() {
	const toast = useRef<Toast>(null);

	const router = useRouter();

	const FormError = ({
		error,
		touched,
	}: {
		error?: string;
		touched?: boolean;
	}) => {
		if (touched && error) return <small className="p-error">{error}</small>;

		return null;
	};

	const formik = useFormik({
		initialValues: defaultValues,
		validate: (values) => {
			const validation = loginFormSchema.safeParse(values);

			if (validation.success) {
				return {};
			}

			const errors: Record<string, string> = {};
			for (const [key, value] of Object.entries(
				validation.error.flatten().fieldErrors
			)) {
				if (value) errors[key] = value[0];
			}

			return errors;
		},
		onSubmit: async (values, { setStatus, setSubmitting }) => {
			setStatus("");

			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				});

				const responseData = await res.json();
				const role = responseData.auth?.user?.role;

				if (!res.ok)
					throw new Error(responseData.message || "Terjadi kesalahan");

				toast.current?.show({
					severity: "success",
					summary: "Login Berhasil",
					detail: responseData.message,
					life: 3000,
				});

				console.log("Login success", responseData.message);

				if (role === "admin") {
					router.push("/admin/dashboard");
				} else if (role === "employee") {
					router.push("karyawan");
				}

				// setTimeout(() => {
				// 	router.push("/admin/dashboard");
				// }, 1500);
			} catch (error: any) {
				setStatus(error.message);

				toast.current?.show({
					severity: "error",
					summary: "Login Gagal",
					detail: error.message,
					life: 3000,
				});
			}
		},

		enableReinitialize: true,
	});

	return (
		<main className="relative min-h-screen">
			<Toast ref={toast} />

			<div className="absolute h-full w-full bg-login-pattern" />

			<div className="absolute inset-0 h-full w-full bg-black/10" />

			<div className="relative z-5 w-full min-h-screen font-bold mx-auto flex align-items-center justify-content-center">
				<div className="hidden p-6 md:w-6 md:min-h-screen md:flex md:align-items-center md:justify-content-center">
					<div className="flex flex-column gap-4 w-9">
						<div className="surface-50 w-7rem h-7rem flex align-items-center justify-content-center border-round-xl shadow-6 mx-auto">
							<img src="/img/logo.png" alt="logo" className="w-4rem" />
						</div>

						<h1 className="text-4xl font-bold text-800 text-center my-0">
							SISTEM INFORMASI SUMBER DAYA MANUSIA
						</h1>

						<p className="text-500 text-center font-normal my-0">
							Selamat datang di Portal Karyawan PT Marstech Global. Silahkan
							masuk untuk melanjutkan.
						</p>
					</div>
				</div>

				<div className="block w-11 h-screen md:w-6 md:p-6 flex align-items-center justify-content-center">
					<div className="relative surface-50 border-round-xl text-800 font-normal md:w-9 shadow-6 py-6 px-4 flex flex-column gap-4 border-top-3 border-red-500">
						<div className="flex justify-content-center">
							<div className="bg-red-500 max-w-min p-4 border-round-xl">
								<i className="pi pi-sign-in text-2xl text-white"></i>
							</div>
						</div>

						<div className="flex flex-column gap-4">
							<h1 className="text-slate-800 text-3xl font-bold text-center">
								Selamat Datang
							</h1>

							<p className="text-500 text-center">
								Silahkan masuk dengan kredensial Anda. Akses absensi, pengajuan
								cuti & lembur, slip gaji, dan lainnya. Silahkan masuk
							</p>
						</div>

						<div className="max-w-full">
							<form
								className="flex flex-column gap-4"
								onSubmit={formik.handleSubmit}
							>
								{formik.status && (
									<div className="p-error text-center">{formik.status}</div>
								)}
								<div className="grid gap-2">
									<label htmlFor="email" className="font-semibold">
										Email
									</label>
									<InputText
										id="email"
										name="email"
										placeholder="ex: budi@example.com"
										value={formik.values.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className={`w-full ${
											formik.touched.email && formik.errors.email
												? "p-invalid"
												: ""
										}`}
									/>

									<FormError
										touched={formik.touched.email}
										error={formik.errors.email}
									/>
								</div>

								<div className="grid gap-2">
									<label htmlFor="password" className="font-semibold">
										Password
									</label>
									<Password
										id="password"
										name="password"
										placeholder="Masukkan password Anda"
										value={formik.values.password}
										onChange={formik.handleChange}
										className={`w-full ${
											formik.touched.password && formik.errors.password
												? "p-invalid"
												: ""
										}`}
										inputClassName="w-full"
										feedback={false}
										toggleMask
									/>

									<FormError
										touched={formik.touched.password}
										error={formik.errors.password}
									/>
								</div>

								<div>
									<Button
										type="submit"
										label="Masuk ke Sistem"
										disabled={formik.isSubmitting}
										className="w-full"
									/>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
