"use client";

import Pet from "@/public/Pet.jpg";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import LoginForms from "../LoginForms";
import { LoginFormSchema, UseLoginForm } from "../LoginForms/types.d";

export default function LoginSection() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  async function submitForm(
    values: LoginFormSchema,
    form: UseLoginForm
  ) {
    try {
      await signIn(values.email, values.password);

      form.reset();
      toast.success("Login realizado com sucesso!");

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error("Erro no frontend ao fazer login:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Erro no login. Tente novamente.");
      }
    }
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="max-lg:hidden w-[40%] bg-[#FCF3E8] min-h-screen flex justify-center">
        <Image
          src={Pet}
          alt="Imagem de um Cão e Gato"
          className="w-130 m-auto"
        />
      </div>

      <div className="w-full lg:w-[60%] space-y-6 p-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-[#0D3B66] min-[712px]:text-4xl">
            Boas Vindas!
          </h1>
        </header>

        <LoginForms submitForm={submitForm} />
      </div>
    </section>
  );
}