"use client";

import { PrimeReactProvider } from "primereact/api";
import { ReactNode } from "react";

const providerOptions = {
  unstyled: false,
  pt: {},
  ripple: true,
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PrimeReactProvider value={providerOptions}>{children}</PrimeReactProvider>
  );
}
