
"use client";
import { registerOrg } from "@/services/orgs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RegisterForms from "../RegisterForm";
import { RegisterFormSchema, UseRegisterForm } from "../RegisterForm/types.d";

export default function RegisterSection() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter()
  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function submitForm(
    values: RegisterFormSchema,
    form: UseRegisterForm
  ) {
    try {
      await registerOrg({
        name: values.name,
        email: values.email,
        state: values.state,
        city: values.city,
        whatsapp: values.whatsapp,
        password: values.password
      });

      form.reset();
      toast.success("Organização cadastrada com sucesso!");
      router.push("/login")
    } catch (error: any) {
      console.error("Erro no frontend ao cadastrar:", error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao cadastrar organização. Tente novamente.");
      }
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-[#0D3B66]">
            Cadastre a sua organização
          </h1>
        </header>

        <RegisterForms submitForm={submitForm} />
      </div>
    </section>
  );
}