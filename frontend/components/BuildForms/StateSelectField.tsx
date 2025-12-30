"use client";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getState, type State } from "@/services/locations";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface StateSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function StateSelectField<T extends FieldValues>({
  control,
  name,
  label,
}: StateSelectFieldProps<T>) {
  const [states, setStates] = useState<State[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getState().then(setStates);
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className="w-full justify-between">
                  {field.value || "Selecione o estado"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Buscar estado..." />
                <CommandList>
                  <CommandEmpty>Nenhum estado encontrado</CommandEmpty>
                  <CommandGroup>
                    {states.map((state) => (
                      <CommandItem
                        key={state.id}
                        onSelect={() => {
                          field.onChange(state.sigla);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === state.sigla ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {state.sigla} - {state.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
