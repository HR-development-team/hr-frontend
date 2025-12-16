import Image from "next/image";

export const LoginBranding = () => {
  return (
    <div className="hidden p-6 md:w-6 md:min-h-screen md:flex md:align-items-center md:justify-content-center">
      <div className="flex flex-column gap-4 w-9">
        <div className="surface-50 w-7rem h-7rem flex align-items-center justify-content-center border-round-xl shadow-6 mx-auto">
          {/* Ensure path to logo is correct */}
          <Image src="/img/logo.png" alt="logo" width={70} height={80} />
        </div>

        <h1 className="text-4xl font-bold text-800 text-center my-0">
          SISTEM INFORMASI SUMBER DAYA MANUSIA
        </h1>

        <p className="text-500 text-center font-normal my-0">
          Selamat datang di Portal Karyawan PT Marstech Global. Silahkan masuk
          untuk melanjutkan.
        </p>
      </div>
    </div>
  );
};
