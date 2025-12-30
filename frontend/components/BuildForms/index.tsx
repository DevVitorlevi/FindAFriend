"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { StateSelectField } from "./StateSelectField";
import { CitySelectField } from "./CitySelectField";

export type FormFieldType = "input" | "state-select" | "city-select";

export interface IFormsFields<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  fieldType?: FormFieldType;
}

interface BuildFormsProps<T extends FieldValues> {
  formsList: UseFormReturn<T>;
  formsFields: Array<IFormsFields<T>>;
}

export default function BuildForms<T extends FieldValues>({
  formsList,
  formsFields,
}: BuildFormsProps<T>) {
  return (
    <>
      {formsFields.map((field) => {
        switch (field.fieldType) {
          case "state-select":
            return (
              <StateSelectField
                key={field.name}
                control={formsList.control}
                name={field.name}
                label={field.label}
              />
            );

          case "city-select":
            return (
              <CitySelectField
                key={field.name}
                form={formsList}
                name={field.name}
                label={field.label}
                stateFieldName={"state" as Path<T>}
              />
            );

          default:
            return (
              <FormField
                key={field.name}
                control={formsList.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type={field.type ?? "text"}
                        placeholder={field.placeholder}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
        }
      })}
    </>
  );
}

