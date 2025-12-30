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
import { getCityByState, type City } from "@/services/locations";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

interface CitySelectFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  stateFieldName: Path<T>;
}

export function CitySelectField<T extends FieldValues>({
  form,
  name,
  label,
  stateFieldName,
}: CitySelectFieldProps<T>) {
  const [cities, setCities] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedState = form.watch(stateFieldName);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      form.setValue(name, "" as any);
      return;
    }

    setLoading(true);
    getCityByState(selectedState)
      .then(setCities)
      .finally(() => setLoading(false));
  }, [selectedState]);

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={!selectedState || loading}
                >
                  {field.value || "Selecione a cidade"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Buscar cidade..." />
                <CommandList>
                  <CommandEmpty>Nenhuma cidade encontrada</CommandEmpty>
                  <CommandGroup>
                    {cities.map((city) => (
                      <CommandItem
                        key={city.id}
                        onSelect={() => {
                          field.onChange(city.nome);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === city.nome ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city.nome}
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
