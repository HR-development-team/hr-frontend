export const LoginHeader = () => {
  return (
    <>
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
          Silahkan masuk dengan kredensial Anda. Akses absensi, pengajuan cuti &
          lembur, slip gaji, dan lainnya. Silahkan masuk
        </p>
      </div>
    </>
  );
};
