"use client";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute h-full w-full bg-login-pattern bg-cover bg-center bg-no-repeat" />

      <div className="absolute inset-0 h-full w-full bg-black/10" />

      <div className="relative z-10 w-full md:w-3/4 min-h-screen font-bold mx-auto flex items-center justify-center">
        <div className="hidden md:w-1/2 md:min-h-screen md:flex md:items-center p-10">
          <div className="space-y-8">
            <div className="bg-slate-50 w-28 h-28 flex items-center justify-center rounded-xl shadow-2xl mx-auto">
              <img src="/img/logo.png" alt="logo" className="w-20" />
            </div>

            <h1 className="text-4xl font-bold text-slate-800 text-center">
              SISTEM INFORMASI SUMBER DAYA MANUSIA
            </h1>

            <p className="text-slate-800 text-center font-normal leading-relaxed">
              Selamat datang di Portal Karyawan PT Marstech Global. Silahkan
              masuk untuk melanjutkan.
            </p>
          </div>
        </div>

        <div className="w-11/12 md:w-1/2 md:p-10">
          <div className="relative bg-slate-50 rounded-xl text-slate-900 font-normal shadow-2xl py-6 space-y-8 border-t-4 border-red-500">
            <div className="flex justify-center">
              <div className="bg-red-500 max-w-min p-4 rounded-2xl">
                <i className="pi pi-sign-in text-2xl text-white"></i>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-slate-800 text-3xl font-bold text-center">
                Selamat Datang
              </h1>

              <p className="text-slate-500 text-base font-normal text-center">
                Silahkan masuk dengan kredensial Anda. Akses absensi, pengajuan
                cuti & lembur, slip gaji, dan lainnya. Silahkan masuk
              </p>
            </div>

            <div className="px-6">
              <form className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="font-semibold">
                    Email
                  </label>
                  <InputText
                    id="email"
                    placeholder="ex: budi@example.com"
                    className="w-full"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="password" className="font-semibold">
                    Password
                  </label>
                  <Password
                    placeholder="Masukkan password Anda"
                    inputClassName="w-full"
                    feedback={false}
                    toggleMask
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    label="Masuk ke Sistem"
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
