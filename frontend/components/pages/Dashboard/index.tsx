"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/useAuth'
import { getPets, type Pet } from '@/services/pets'
import { Image, Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardSection() {
  const { user } = useAuth()
  const router = useRouter()
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
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-xl font-semibold text-[#0D3B66]">Lista de Pets</h2>
              <p className="text-sm text-slate-600 mt-1">Visualize e gerencie todos os pets cadastrados</p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/create')}
              className="bg-[#E44449] hover:bg-[#E44449]/90 text-white font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Pet
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#0D3B66] hover:bg-[#0D3B66]">
                <TableHead className="text-white font-semibold">Nome</TableHead>
                <TableHead className="text-white font-semibold">Descrição</TableHead>
                <TableHead className="text-center text-white font-semibold">Idade</TableHead>
                <TableHead className="text-center text-white font-semibold">Porte</TableHead>
                <TableHead className="text-center text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Data Cadastro</TableHead>
                <TableHead className="text-white font-semibold">Acoes</TableHead>
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
                    </TableCell><TableCell className="text-slate-600">
                      <Button onClick={() => router.push(`/dashboard/${pet.id}/images`)} className='bg-[#0D3B66] text-white hover:bg-[#0D3B66]/90 cursor-pointer'>
                        <Image />
                      </Button>
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