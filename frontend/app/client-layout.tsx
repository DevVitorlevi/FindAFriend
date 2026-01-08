'use client';

import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isPublicPage = pathname === '/login' || pathname === '/register' || pathname === '/';

  if (!isPublicPage) {
    useTokenRefresh();
  }

  return <>{children}</>;
}