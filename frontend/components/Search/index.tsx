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
import { getCidadesByEstado, getEstados, type Cidade, type Estado } from '@/lib/api/locations'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, Search } from "lucide-react"
import { useEffect, useState } from 'react'

export function SearchPet() {
  const [estados, setEstados] = useState<Estado[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [estadoSelecionado, setEstadoSelecionado] = useState<Estado | null>(null)
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(null)
  const [loadingCidades, setLoadingCidades] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const [openCidade, setOpenCidade] = useState(false)

  // Carregar estados ao montar o componente
  useEffect(() => {
    async function loadEstados() {
      try {
        const data = await getEstados()
        setEstados(data)
      } catch (error) {
        console.error('Erro ao carregar estados:', error)
      }
    }
    loadEstados()
  }, [])

  // Carregar cidades quando o estado mudar
  useEffect(() => {
    async function loadCidades() {
      if (!estadoSelecionado) {
        setCidades([])
        return
      }

      setLoadingCidades(true)
      setCidadeSelecionada(null)

      try {
        const data = await getCidadesByEstado(estadoSelecionado.sigla)
        setCidades(data)
      } catch (error) {
        console.error('Erro ao carregar cidades:', error)
      } finally {
        setLoadingCidades(false)
      }
    }

    loadCidades()
  }, [estadoSelecionado])

  const handleSearch = () => {
    console.log('Buscar:', {
      state: estadoSelecionado?.sigla,
      city: cidadeSelecionada?.nome
    })
    //TODO:Fazer Busca do Pet
  }

  return (
    <div className="flex items-center space-x-5">
      <p className="text-white text-xl">Busque Por Um Amigo:</p>

      {/* Select Estado com busca */}
      <Popover open={openEstado} onOpenChange={setOpenEstado}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openEstado}
            className="px-4 py-6 text-xl border-2 border-white text-white bg-transparent hover:bg-white/10 rounded-xl min-w-35 justify-between"
          >
            {estadoSelecionado ? estadoSelecionado.sigla : "Estado"}
            <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-45 p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar estado..." className="h-10" />
            <CommandList>
              <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
              <CommandGroup className="max-h-25 overflow-auto">
                {estados.map((estado) => (
                  <CommandItem
                    key={estado.id}
                    value={`${estado.sigla} ${estado.nome}`}
                    onSelect={() => {
                      setEstadoSelecionado(estado)
                      setOpenEstado(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        estadoSelecionado?.id === estado.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-semibold">{estado.sigla}</span>
                    <span className="ml-2 text-muted-foreground">- {estado.nome}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Select Cidade com busca */}
      <Popover open={openCidade} onOpenChange={setOpenCidade}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCidade}
            disabled={!estadoSelecionado || loadingCidades}
            className="px-4 py-6 text-xl border-2 border-white text-white bg-transparent hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl min-w-50 justify-between"
          >
            {loadingCidades
              ? "Carregando..."
              : cidadeSelecionada
                ? cidadeSelecionada.nome
                : "Cidade"}
            <ChevronDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50 p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar cidade..." className="h-10" />
            <CommandList>
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
              <CommandGroup className="max-h-25 overflow-auto">
                {cidades.map((cidade) => (
                  <CommandItem
                    key={cidade.id}
                    value={cidade.nome}
                    onSelect={() => {
                      setCidadeSelecionada(cidade)
                      setOpenCidade(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        cidadeSelecionada?.id === cidade.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {cidade.nome}
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
        disabled={!estadoSelecionado || !cidadeSelecionada}
      >
        <Search className="h-6 w-6 text-blue-900" />
      </Button>
    </div>
  )
}