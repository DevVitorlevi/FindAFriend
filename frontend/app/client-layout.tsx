"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function TokenRefresher() {
  useTokenRefresh();
  return null;
}

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isPublicPage =
    pathname === "/login" || pathname === "/register" || pathname === "/";

  return (
    <>
      {!isPublicPage && <TokenRefresher />}
      {children}
    </>
  );
}
