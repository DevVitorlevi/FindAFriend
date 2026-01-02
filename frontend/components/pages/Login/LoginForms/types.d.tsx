import { loginBodySchema } from "@/lib/validations/login";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export type LoginFormSchema = z.infer<typeof loginBodySchema>;
export type UseLoginForm = UseFormReturn<LoginFormSchema>;

export type LoginFormProps = {
  submitForm: (values: LoginFormSchema, form: UseLoginForm) => Promise<void>;
};
