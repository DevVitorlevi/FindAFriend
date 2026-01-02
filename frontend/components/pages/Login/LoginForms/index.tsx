"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import BuildForms, {
  IFormsFields,
} from "@/components/BuildForms";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginBodySchema } from "@/lib/validations/login";

import {
  LoginFormProps,
  LoginFormSchema,
} from "./types.d";

const LoginForms = ({ submitForm }: LoginFormProps) => {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormSchema) {
    console.log(values)
    await submitForm(values, form);
  }

  const formFields: IFormsFields<LoginFormSchema>[] = [
    {
      label: "E-mail",
      name: "email",
      placeholder: "ex: nome@email.com",
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
            className="mt-4 text-xl bg-[#0D3B66] min-[712px]:text-xl py-6"
            disabled={form.formState.isSubmitting}
          >
            Entrar
          </Button>

          <Button
            asChild
            type="button"
            variant="secondary"
            className="mt-4"
          >
            <Link
              href="/register"
              className="text-[#0D3B66] min-[712px]:text-xl font-bold"
            >
              Cadastrar minha Organizacao
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForms;
