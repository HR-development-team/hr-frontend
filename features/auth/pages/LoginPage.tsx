"use client";

import { LoginBranding } from "../components/LoginBranding";
import { LoginForm } from "../components/LoginForm";
import { LoginHeader } from "../components/LoginHeader";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen">
      {/* Backgrounds */}
      <div className="absolute h-full w-full bg-login-pattern" />
      <div className="absolute inset-0 h-full w-full bg-black/10" />

      <div className="relative z-5 w-full min-h-screen font-bold mx-auto flex align-items-center justify-content-center">
        {/* Left Side (Branding) */}
        <LoginBranding />

        {/* Right Side (Form Container) */}
        <div className="block w-11 h-screen md:w-6 md:p-6 flex align-items-center justify-content-center">
          <div className="relative surface-50 border-round-xl text-800 font-normal md:w-9 shadow-6 py-6 px-4 flex flex-column gap-4 border-top-3 border-red-500">
            <LoginHeader />

            <div className="max-w-full">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
