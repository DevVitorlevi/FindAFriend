"use client"

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getPets, type Pet } from '@/services/pets'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function DashboardSection() {
  const { user } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadPets()
    }
  }, [user?.id])

  const loadPets = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await getPets({ id: user.id })
      console.log('Resposta completa da API:', response)
      console.log('Pets recebidos:', response.pets)

      const fetchedPets = Array.isArray(response.pets) ? response.pets : []
      setPets(fetchedPets)
    } catch (error) {
      console.error('Erro ao carregar pets:', error)
      setPets([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#E44449]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0D3B66]">Dashboard de Pets</h1>
            <p className="text-slate-600 mt-1">Gerencie todos os pets da sua organização</p>
          </div>
          <Badge className="text-sm bg-[#F4D35E] text-[#0D3B66] hover:bg-[#F4D35E]/90 px-4 py-2">
            Total: {pets.length} {pets.length === 1 ? 'pet' : 'pets'}
          </Badge>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#0D3B66] hover:bg-[#0D3B66]">
                <TableHead className="text-white font-semibold">Nome</TableHead>
                <TableHead className="text-white font-semibold">Descrição</TableHead>
                <TableHead className="text-center text-white font-semibold">Idade</TableHead>
                <TableHead className="text-center text-white font-semibold">Porte</TableHead>
                <TableHead className="text-center text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Data Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    Nenhum pet encontrado
                  </TableCell>
                </TableRow>
              ) : (
                pets.map((pet) => (
                  <TableRow key={pet.id} className="hover:bg-slate-50 transition-colors border-b border-slate-200">
                    <TableCell className="font-medium text-[#0D3B66]">{pet.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-slate-600">
                      {pet.description}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-[#F4D35E] text-[#0D3B66] hover:bg-[#F4D35E]/90">
                        {pet.age}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-[#0D3B66] text-white hover:bg-[#0D3B66]/90">
                        {pet.size}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={pet.adopted ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-[#E44449] text-white hover:bg-[#E44449]/90'}
                      >
                        {pet.adopted ? 'Adotado' : 'Disponível'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(pet.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}