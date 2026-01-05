import { createPetBodySchema } from "@/lib/validations/create";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
export type CreatePetFormSchema = z.infer<typeof createPetBodySchema>;
export type UseCreatePetForm = UseFormReturn<CreatePetFormSchema>;

export type CreatePetFormProps = {
  submitForm: (values: CreatePetFormSchema, form: UseCreatePetForm) => Promise<void>;
};
