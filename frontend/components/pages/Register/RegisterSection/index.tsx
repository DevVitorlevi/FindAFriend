
"use client";
import { registerOrg } from "@/services/orgs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RegisterForms from "../RegisterForm";
import { RegisterFormSchema, UseRegisterForm } from "../RegisterForm/types.d";
import Image from "next/image";
import Pet from "@/public/Pet.jpg"
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
    <section className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="max-lg:hidden w-[40%] bg-[#FCF3E8] min-h-screen flex flex-col align-items justify-center">
        <Image src={Pet} alt="Imagem de um Cao e Gato" className="w-130 m-auto" />
      </div>
      <div className="w-full lg:w-[60%] space-y-6 p-6">
        <header className="space-y-2 text-center flex items-center justify-center">
          <h1 className="text-3xl font-semibold text-[#0D3B66] min-[712px]:text-4xl">
            Cadastre a sua organização
          </h1>
        </header>
        <RegisterForms submitForm={submitForm} />
      </div>
    </section>
  );
}