"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import BuildForms, {
  IFormsFields,
} from "@/components/BuildForms";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { registerBodySchema } from "@/lib/validations/register";

import { maskWhatsapp } from "@/utils/masks";
import {
  RegisterFormProps,
  RegisterFormSchema,
} from "./types.d";

const RegisterForms = ({ submitForm }: RegisterFormProps) => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerBodySchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      state: "",
      whatsapp: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormSchema) {
    console.log(values)
    await submitForm(values, form);
  }

  const formFields: IFormsFields<RegisterFormSchema>[] = [
    {
      label: "Nome completo",
      name: "name",
      placeholder: "Inserir nome",
    },
    {
      label: "E-mail",
      name: "email",
      placeholder: "ex: nome@email.com",
    },
    {
      label: "Estado",
      name: "state",
      fieldType: "state-select",
    },
    {
      label: "Cidade",
      name: "city",
      fieldType: "city-select",
    },
    {
      label: "Whatsapp",
      name: "whatsapp",
      placeholder: "ex: (12) 34567-8901",
      onChangeValue: maskWhatsapp,
    },
    {
      label: "Senha",
      name: "password",
      placeholder: "Insira sua senha",
      type: "password",
    },
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
