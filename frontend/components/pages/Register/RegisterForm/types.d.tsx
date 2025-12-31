import { registerBodySchema } from "@/lib/validations/register";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export type RegisterFormSchema = z.infer<typeof registerBodySchema>;
export type UseRegisterForm = UseFormReturn<RegisterFormSchema>;

export type RegisterFormProps = {
  submitForm: (values: RegisterFormSchema, form: UseRegisterForm) => Promise<void>;
};
