"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import BuildForms, {
  IFormsFields,
} from "@/components/BuildForms";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createPetBodySchema } from "@/lib/validations/create";
import { maskWhatsapp } from "@/utils/masks";
import {
  CreatePetFormProps,
  CreatePetFormSchema
} from "./types.d";

const RegisterForms = ({ submitForm }: CreatePetFormProps) => {
  const form = useForm<CreatePetFormSchema>({
    resolver: zodResolver(createPetBodySchema),
    defaultValues: {
      name: "",
      description: "",
      age: "FILHOTE",
      size: "PEQUENO"
    },
  });

  async function onSubmit(values: CreatePetFormSchema) {
    console.log(values)
    await submitForm(values, form);
  }

  const formFields: IFormsFields<CreatePetFormSchema>[] = [
    {
      label: "Nome",
      name: "name",
      placeholder: "Inserir nome do Pet",
    },
    {
      label: "Descricao",
      name: "description",
      placeholder: "Inserir Descricao do Pet",
    },
    {
      label: "Idade do Pet",
      name: "age",
    },
    {
      label: "Tamanho do Pet",

    }
  ];

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 m-auto min-[712px]:w-[80%] lg:w-[60%]"
      >
        <BuildForms
          formsList={form}
          formsFields={formFields}
        />

        <div className="flex flex-col">
          <Button
            type="submit"
            className="mt-4 bg-[#0D3B66] min-[712px]:text-xl py-6"
            disabled={form.formState.isSubmitting}
          >
            Cadastrar
          </Button>

          <Button
            asChild
            type="button"
            variant="link"
            className="mt-4"
          >
            <Link
              href="/login"
              className="text-[#0D3B66] min-[712px]:text-xl"
            >
              Já Possui Conta?
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForms;
