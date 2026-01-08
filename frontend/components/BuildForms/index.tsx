"use client";

import * as React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

import { StateSelectField } from "./StateSelectField";
import { CitySelectField } from "./CitySelectField";


export type FormFieldType =
  | "input"
  | "select"
  | "textarea"
  | "state-select"
  | "city-select";

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IFormsFields<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  fieldType?: FormFieldType;
  onChangeValue?: (value: string) => string;

  options?: ISelectOption[];
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

          case "select":
            return (
              <FormField
                key={field.name}
                control={formsList.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>

                    <Select
                      value={formField.value}
                      onValueChange={(value) => {
                        if (field.onChangeValue) {
                          formField.onChange(
                            field.onChangeValue(value)
                          );
                        } else {
                          formField.onChange(value);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              field.placeholder ??
                              "Selecione uma opção"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            );

          case "textarea":
            return (
              <FormField
                key={field.name}
                control={formsList.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>

                    <FormControl>
                      <Textarea
                        {...formField}
                        placeholder={field.placeholder}
                        className="w-full resize-none"
                        onChange={(e) => {
                          const value = e.target.value;

                          if (field.onChangeValue) {
                            formField.onChange(
                              field.onChangeValue(value)
                            );
                          } else {
                            formField.onChange(value);
                          }
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
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
                        onChange={(e) => {
                          const value = e.target.value;

                          if (field.onChangeValue) {
                            formField.onChange(
                              field.onChangeValue(value)
                            );
                          } else {
                            formField.onChange(value);
                          }
                        }}
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
