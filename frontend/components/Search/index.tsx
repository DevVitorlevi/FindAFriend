"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getCityByState,
  getState,
  type City,
  type State,
} from "@/services/locations";
import { searchPet } from "@/services/pets";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Icon from "@/public/Search.png";

export function SearchPet() {
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function loadStates() {
      try {
        const data = await getState();
        setStates(data);
      } catch (error) {
        console.error("Erro ao carregar estados:", error);
      }
    }
    loadStates();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (!selectedState) {
        setCities([]);
        return;
      }

      setLoadingCities(true);
      setSelectedCity(null);

      try {
        const data = await getCityByState(selectedState.sigla);
        setCities(data);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, [selectedState]);

  const handleSearch = async () => {
    if (!selectedState || !selectedCity) return;

    setIsSearching(true);
    try {
      await searchPet({
        city: selectedCity.nome,
        state: selectedState.sigla,
        adopted: false,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full space-y-4 px-4">
      <div className="w-full flex flex-row gap-2 items-center">
        <Popover open={openState} onOpenChange={setOpenState}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openState}
              aria-label="Selecionar estado"
              className="w-20 shrink-0 px-3 py-8 text-base border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-xl justify-between transition-all"
            >
              <span className="truncate text-lg font-semibold">
                {selectedState ? selectedState.sigla : "UF"}
              </span>
              <ChevronDown
                className={cn(
                  "ml-1 h-4 w-4 shrink-0 opacity-50 transition-transform",
                  openState && "rotate-180",
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="start" sideOffset={4}>
            <Command>
              <CommandInput
                placeholder="Buscar UF..."
                className="h-11 text-base"
              />
              <CommandList>
                <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                <CommandGroup className="max-h-72 overflow-auto">
                  {states.map((state) => (
                    <CommandItem
                      key={state.id}
                      value={state.sigla}
                      keywords={[state.sigla]}
                      onSelect={() => {
                        setSelectedState(state);
                        setOpenState(false);
                      }}
                      className="cursor-pointer py-3"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          selectedState?.id === state.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="font-semibold">{state.sigla}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Cidade — ocupa o resto do espaço */}
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              aria-label="Selecionar cidade"
              disabled={!selectedState || loadingCities}
              className="flex-1 px-4 py-8 text-base border-2 border-white text-white bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl justify-between transition-all"
            >
              <span className="truncate text-lg">
                {loadingCities
                  ? "Carregando..."
                  : selectedCity
                    ? selectedCity.nome
                    : "Cidade"}
              </span>
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform",
                  openCity && "rotate-180",
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start" sideOffset={4}>
            <Command>
              <CommandInput
                placeholder="Buscar cidade..."
                className="h-11 text-base"
              />
              <CommandList>
                <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                <CommandGroup className="max-h-72 overflow-auto">
                  {cities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.nome}
                      onSelect={() => {
                        setSelectedCity(city);
                        setOpenCity(false);
                      }}
                      className="cursor-pointer py-3"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          selectedCity?.id === city.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="truncate">{city.nome}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          className="shrink-0 w-17 h-17 bg-[#F4D35E] hover:bg-yellow-500 rounded-xl text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          onClick={handleSearch}
          disabled={!selectedState || !selectedCity || isSearching}
        >
          {isSearching ? (
            <span className="h-8 w-8 border-4 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
          ) : (
            <Image src={Icon} alt={""} />
          )}
        </Button>
      </div>
    </div>
  );
}
