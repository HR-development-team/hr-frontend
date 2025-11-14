"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";
import { PrimeReactProvider } from "primereact/api";
import Header from "@/components/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathName = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathName]);
  return (
    <PrimeReactProvider>
      <div className="min-h-screen surface-50">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div style={{ height: "calc(100vh - 5rem)" }} className="flex pt-8">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main
            style={{ height: "calc(100vh - 5rem)" }}
            className="relative flex-1 surface-100 transition-all animation-duration-300 min-w-0"
          >
            {/* backdrop for mobile sidebar */}
            {sidebarOpen && (
              <div
                className="fixed top-0 right-0 bottom-0 left-0 z-3 surface-900 opacity-50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}
            <div
              style={{ height: "calc(100vh - 5rem)" }}
              className="overflow-y-auto flex justify-content-center"
              // className="overflow-y-auto"
            >
              <div className="w-full py-4 px-4 md:px-6">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </PrimeReactProvider>
  );
}
