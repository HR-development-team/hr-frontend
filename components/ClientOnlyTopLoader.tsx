"use client";

import { useState, useEffect } from "react";
import NextTopLoader from "nextjs-toploader";

export const ClientOnlyTopLoader = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <NextTopLoader color="red" height={3} showSpinner={false} />;
};
