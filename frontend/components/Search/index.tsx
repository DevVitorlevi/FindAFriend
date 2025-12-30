'use client'

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import { getCityByState, getState, type City, type State } from '@/services/locations'
import { searchPet } from "@/services/pets"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { useEffect, useState } from 'react'

export function SearchPet() {
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loadingCities, setLoadingCities] = useState(false)
  const [openState, setOpenState] = useState(false)
  const [openCity, setOpenCity] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Carregar estados ao montar o componente
  useEffect(() => {
    async function loadStates() {
      try {
        const data = await getState()
        setStates(data)
      } catch (error) {
        console.error('Erro ao carregar estados:', error)
      }
    }
    loadStates()
  }, [])

  // Carregar cidades quando o estado mudar
  useEffect(() => {
    async function loadCities() {
      if (!selectedState) {
        setCities([])
        return
      }

      setLoadingCities(true)
      setSelectedCity(null)

      try {
        const data = await getCityByState(selectedState.sigla)
        setCities(data)
      } catch (error) {
        console.error('Erro ao carregar cidades:', error)
      } finally {
        setLoadingCities(false)
      }
    }

    loadCities()
  }, [selectedState])

  const handleSearch = async () => {
    if (!selectedState || !selectedCity) return

    setIsSearching(true)
    try {
      await searchPet({
        city: selectedCity.nome,
        state: selectedState.sigla,
        adopted: false
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  const clearState = () => {
    setSelectedState(null)
    setSelectedCity(null)
    setCities([])
  }

  const clearCity = () => {
    setSelectedCity(null)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4 px-4">
      <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
        Busque por um amigo
      </h2>

      <div className="w-full max-w-md space-y-3">
        {/* Select Estado com busca */}
        <div className="relative">
          <Popover open={openState} onOpenChange={setOpenState}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openState}
                aria-label="Selecionar estado"
                className="w-full px-6 py-8 text-base md:text-lg border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-xl justify-between transition-all"
              >
                <span className="truncate md:text-2xl">
                  {selectedState ? (
                    <span>
                      <span className="font-semibold  md:text-2xl">{selectedState.sigla}</span>
                      <span className="hidden sm:inline text-white/80 md:text-2xl"> - {selectedState.nome}</span>
                    </span>
                  ) : (
                    "Selecione o estado"
                  )}
                </span>
                <ChevronDown className={cn(
                  "ml-2 h-5 w-5 shrink-0 opacity-50 transition-transform",
                  openState && "rotate-180"
                )} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
              sideOffset={4}
            >
              <Command>
                <CommandInput
                  placeholder="Buscar estado..."
                  className="h-11 text-base"
                />
                <CommandList>
                  <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-75 overflow-auto">
                    {states.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={`${state.sigla} ${state.nome}`}
                        onSelect={() => {
                          setSelectedState(state)
                          setOpenState(false)
                        }}
                        className="cursor-pointer py-3"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            selectedState?.id === state.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-semibold">{state.sigla}</span>
                        <span className="ml-2 text-muted-foreground truncate ">
                          - {state.nome}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedState && (
            <button
              onClick={clearState}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              aria-label="Limpar estado"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Select Cidade com busca */}
        <div className="relative">
          <Popover open={openCity} onOpenChange={setOpenCity}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCity}
                aria-label="Selecionar cidade"
                disabled={!selectedState || loadingCities}
                className="w-full px-6 py-8 text-base md:text-lg border-2 border-white text-white bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl justify-between transition-all"
              >
                <span className="truncate md:text-2xl">
                  {loadingCities
                    ? "Carregando cidades..."
                    : selectedCity
                      ? selectedCity.nome
                      : selectedState
                        ? "Selecione a cidade"
                        : "Selecione o estado primeiro"}
                </span>
                <ChevronDown className={cn(
                  "ml-2 h-5 w-5 shrink-0 opacity-50 transition-transform",
                  openCity && "rotate-180"
                )} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
              sideOffset={4}
            >
              <Command>
                <CommandInput
                  placeholder="Buscar cidade..."
                  className="h-11 text-2xl"
                />
                <CommandList>
                  <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                  <CommandGroup className="max-h-75 overflow-auto">
                    {cities.map((city) => (
                      <CommandItem
                        key={city.id}
                        value={city.nome}
                        onSelect={() => {
                          setSelectedCity(city)
                          setOpenCity(false)
                        }}
                        className="cursor-pointer py-3"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            selectedCity?.id === city.id ? "opacity-100" : "opacity-0"
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

          {selectedCity && (
            <button
              onClick={clearCity}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              aria-label="Limpar cidade"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Botão de busca */}
        <Button
          className="w-full bg-yellow-400 hover:bg-yellow-500 rounded-xl h-14 text-base md:text-2xl font-semibold text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          onClick={handleSearch}
          disabled={!selectedState || !selectedCity || isSearching}
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
              Buscando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar pets
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}