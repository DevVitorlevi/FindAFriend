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
import { Check, ChevronDown, Search } from "lucide-react"
import { useEffect, useState } from 'react'

export function SearchPet() {
  const [State, setState] = useState<State[]>([])
  const [City, setCity] = useState<City[]>([])
  const [selectState, setselectState] = useState<State | null>(null)
  const [selectCity, setselectCity] = useState<City | null>(null)
  const [loadingCity, setLoadingCity] = useState(false)
  const [openState, setOpenState] = useState(false)
  const [openCity, setOpenCity] = useState(false)

  // Carregar States ao montar o componente
  useEffect(() => {
    async function loadStates() {
      try {
        const data = await getState()
        setState(data)
      } catch (error) {
        console.error('Erro ao carregar States:', error)
      }
    }
    loadStates()
  }, [])

  // Carregar Citys quando o Statemudar
  useEffect(() => {
    async function loadCitys() {
      if (!selectState) {
        setCity([])
        return
      }

      setLoadingCity(true)
      setselectCity(null)

      try {
        const data = await getCityByState(selectState.sigla)
        setCity(data)
      } catch (error) {
        console.error('Erro ao carregar Cidade', error)
      } finally {
        setLoadingCity(false)
      }
    }

    loadCitys()
  }, [selectState])

  const handleSearch = async () => {
    try {
      await searchPet({
        city: selectCity?.nome,
        state: selectState?.sigla,
        adopted: false
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex items-center space-x-5">
      <p className="text-white text-xl">Busque Por Um Amigo:</p>

      {/* Select Statecom busca */}
      <Popover open={openState} onOpenChange={setOpenState}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openState}
            className="px-4 py-6 text-xl border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-xl min-w-35 justify-between"
          >
            {selectState ? selectState.sigla : "State"}
            <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-45 p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar State..." className="h-10" />
            <CommandList>
              <CommandEmpty>Nenhum Stateencontrado.</CommandEmpty>
              <CommandGroup className="max-h-25 overflow-auto">
                {State.map((State) => (
                  <CommandItem
                    key={State.id}
                    value={`${State.sigla} ${State.nome}`}
                    onSelect={() => {
                      setselectState(State)
                      setOpenState(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectState?.id === State.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-semibold">{State.sigla}</span>
                    <span className="ml-2 text-muted-foreground">- {State.nome}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Select City com busca */}
      <Popover open={openCity} onOpenChange={setOpenCity}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCity}
            disabled={!selectState || loadingCity}
            className="px-4 py-6 text-xl border-2 border-white text-white bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl min-w-50 justify-between"
          >
            {loadingCity
              ? "Carregando..."
              : selectCity
                ? selectCity.nome
                : "City"}
            <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50 p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar Cidade..." className="h-10" />
            <CommandList>
              <CommandEmpty>Nenhuma City encontrada.</CommandEmpty>
              <CommandGroup className="max-h-25 overflow-auto">
                {City.map((City) => (
                  <CommandItem
                    key={City.id}
                    value={City.nome}
                    onSelect={() => {
                      setselectCity(City)
                      setOpenCity(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectCity?.id === City.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {City.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        size="icon"
        className="bg-yellow-400 hover:bg-yellow-500 rounded-md h-14 w-14"
        onClick={handleSearch}
        disabled={!selectState || !setselectCity}
      >
        <Search className="h-6 w-6 text-blue-900" />
      </Button>
    </div>
  )
}