"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import BuildForms, {
  IFormsFields,
} from "@/components/BuildForms";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { createPetBodySchema } from "@/lib/validations/create";

import {
  CreatePetFormProps,
  CreatePetFormSchema,
} from "./types.d";

const CreatePetForms = ({ submitForm }: CreatePetFormProps) => {
  const form = useForm<CreatePetFormSchema>({
    resolver: zodResolver(createPetBodySchema),
    defaultValues: {
      name: "",
      description: "",
      age: "FILHOTE",
      size: "PEQUENO",
    },
  });

  async function onSubmit(values: CreatePetFormSchema) {
    await submitForm(values, form);
  }

  const formFields: IFormsFields<CreatePetFormSchema>[] = [
    {
      label: "Nome",
      name: "name",
      placeholder: "Inserir nome do Pet",
    },
    {
      label: "Descrição",
      name: "description",
      fieldType: "textarea",
      placeholder: "Inserir descrição do Pet",
    },
    {
      label: "Idade do Pet",
      name: "age",
      fieldType: "select",
      placeholder: "Selecione a idade",
      options: [
        { label: "Filhote", value: "FILHOTE" },
        { label: "Adulto", value: "ADULTO" },
        { label: "Idoso", value: "IDOSO" },
      ],
    },
    {
      label: "Tamanho do Pet",
      name: "size",
      fieldType: "select",
      placeholder: "Selecione o tamanho",
      options: [
        { label: "Pequeno", value: "PEQUENO" },
        { label: "Médio", value: "MEDIO" },
        { label: "Grande", value: "GRANDE" },
      ],
    },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 m-auto"
      >
        <BuildForms
          formsList={form}
          formsFields={formFields}
        />

        <div className="flex flex-col">
          <Button
            type="submit"
            className="mt-4 bg-[#F4D35E] min-[712px]:text-xl py-6 text-[##0D3B66] hover:bg-amber-300"
            disabled={form.formState.isSubmitting}
          >
            Confirmar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatePetForms;
