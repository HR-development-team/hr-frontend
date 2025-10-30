"use client";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

export default function Home() {
  return (
    <main className="relative min-h-screen">
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
              <form className="flex flex-column gap-4">
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
                    className="w-full"
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
