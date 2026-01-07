"use client";
import { useAuth } from "@/hooks/useAuth";
import { createPet, type Age, type Size } from "@/services/pets";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreatePetForms from "../CreateForms";
import { CreatePetFormSchema, UseCreatePetForm } from "../CreateForms/types.d";

export default function CreatePetSection() {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      toast.error("Você precisa estar logado para cadastrar um pet");
      router.push("/login");
    }
  }, [isMounted, user, router]);

  async function submitForm(
    values: CreatePetFormSchema,
    form: UseCreatePetForm
  ) {
    try {
      if (!user?.id) {
        toast.error("Você precisa estar logado para cadastrar um pet");
        router.push("/login");
        return;
      }

      await createPet({
        orgId: user.id,
        name: values.name,
        description: values.description,
        age: values.age as Age,
        size: values.size as Size
      });

      form.reset();
      toast.success("Pet cadastrado com sucesso!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro no frontend ao cadastrar:", error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao cadastrar Pet. Tente novamente.");
      }
    }
  }

  if (!isMounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="w-250 space-y-6 p-6 ">
        <header className="space-y-2 text-center flex items-center justify-center">
          <h1 className="text-3xl font-semibold text-[#0D3B66] min-[712px]:text-4xl">
            Cadastre o seu Pet
          </h1>
        </header>
        <CreatePetForms submitForm={submitForm} />
      </div>
    </section>
  );
}