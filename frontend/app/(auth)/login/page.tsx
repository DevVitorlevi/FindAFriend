import { Suspense } from "react";
import LoginSection from "@/components/pages/Login/LoginSection";

export default function Login() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginSection />
    </Suspense>
  );
}
