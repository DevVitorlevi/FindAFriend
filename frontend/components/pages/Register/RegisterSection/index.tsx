
"use client";

import { useState, useEffect } from "react";
import { registerOrg } from "@/services/orgs";
import RegisterForms from "../RegisterForm";
import { RegisterFormSchema, UseRegisterForm } from "../RegisterForm/types.d";
import { toast } from "sonner";

export default function RegisterSection() {
  const [isMounted, setIsMounted] = useState(false);

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
        cep: values.cep,
        state: values.state,
        city: values.city,
        whatsapp: values.whatsapp,
        password: values.password
      });

      form.reset();
      toast.success("Organização cadastrada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar organização. Tente novamente.");
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