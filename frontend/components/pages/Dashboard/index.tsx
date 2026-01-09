"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { adoptedPet, getPets, type Pet } from '@/services/pets'
import { Image, Loader2, PawPrint, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardSection() {
  const { user } = useAuth()
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

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

  function handleAdopted(petId: string) {
    setSelectedPetId(petId)
    setIsAlertOpen(true)
  }

  async function confirmAdoption() {
    if (!selectedPetId) return

    try {
      await adoptedPet({ petId: selectedPetId })
      setIsAlertOpen(false)
      setSelectedPetId(null)
      // Recarregar a lista de pets
      await loadPets()
    } catch (error) {
      console.error('Erro ao adotar pet:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#E44449]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Pets</h1>
        <p className="text-gray-600 mt-2">
          Gerencie todos os pets da sua organização
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="text-sm">
            Total: {pets.length} {pets.length === 1 ? 'pet' : 'pets'}
          </Badge>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Lista de Pets
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualize e gerencie todos os pets cadastrados
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/create')}
              className="bg-[#E44449] hover:bg-[#E44449]/90 text-white font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Cadastrar Pet
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Porte</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum pet encontrado
                </TableCell>
              </TableRow>
            ) : (
              pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">{pet.name}</TableCell>
                  <TableCell>{pet.description}</TableCell>
                  <TableCell>{pet.age}</TableCell>
                  <TableCell>{pet.size}</TableCell>
                  <TableCell>
                    <Badge
                      variant={pet.adopted ? 'default' : 'secondary'}
                      className={
                        pet.adopted ? 'bg-green-500 hover:bg-green-600' : ''
                      }
                    >
                      {pet.adopted ? 'Adotado' : 'Disponível'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(pet.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.push(`/dashboard/${pet.id}/images`)}
                        className="bg-[#0D3B66] text-white hover:bg-[#0D3B66]/90 cursor-pointer"
                      >
                        <Image />
                      </Button>
                      {!pet.adopted && (
                        <Button
                          onClick={() => handleAdopted(pet.id)}
                          className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        >
                          <PawPrint />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Adoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja marcar este pet como adotado? Esta ação
              atualizará o status do pet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPetId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAdoption}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar Adoção
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}