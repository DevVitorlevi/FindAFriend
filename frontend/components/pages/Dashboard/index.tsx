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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import { adoptedPet, getPets, type Pet } from "@/services/pets"
import { Image, Loader2, PawPrint, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardSection() {
  const { user } = useAuth()
  const router = useRouter()

  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  useEffect(() => {
    if (user?.id) loadPets()
  }, [user?.id])

  async function loadPets() {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await getPets({ id: user.id })
      setPets(Array.isArray(response.pets) ? response.pets : [])
    } catch (error) {
      console.error("Erro ao carregar pets:", error)
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
      await loadPets()
    } catch (error) {
      console.error("Erro ao adotar pet:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#E44449]" />
      </div>
    )
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen p-6 space-y-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border-l-4 border-[#E44449] p-6">
        <h1 className="text-3xl font-bold text-[#0D3B66]">
          Dashboard de Pets
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie todos os pets da sua organização
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-transparent rounded-xl p-6 flex items-center justify-end space-x-4">
        <div>
          <p className="text-2xl font-bold text-[#0D3B66]">
            {pets.length}
          </p>
        </div>

        <Badge className="bg-yellow-400 text-yellow-900 px-4 py-1 text-sm">
          {pets.length === 1 ? "Pet cadastrado" : "Pets cadastrados"}
        </Badge>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0D3B66]">
              Lista de Pets
            </h2>
          </div>

          <Button
            onClick={() => router.push("/dashboard/create")}
            className="bg-[#E44449] hover:bg-[#d63b40] text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 shadow-md"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Pet
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-[#0D3B66]/5">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Porte</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  Nenhum pet encontrado
                </TableCell>
              </TableRow>
            ) : (
              pets.map((pet) => (
                <TableRow key={pet.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {pet.name}
                  </TableCell>

                  <TableCell className="max-w-xs truncate">
                    {pet.description}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="bg-[#E44449] text-white">
                      {pet.age}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className="bg-[#0D3B66] text-white">
                      {pet.size}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        pet.adopted
                          ? "bg-green-500 text-white"
                          : "bg-yellow-400 text-yellow-900"
                      }
                    >
                      {pet.adopted ? "Adotado" : "Disponível"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          router.push(`/dashboard/${pet.id}/images`)
                        }
                        className="bg-[#0D3B66] text-white hover:bg-[#0D3B66]/90 px-3"
                      >
                        <Image className="h-4 w-4" />
                      </Button>

                      {!pet.adopted && (
                        <Button
                          onClick={() => handleAdopted(pet.id)}
                          className="bg-green-600 text-white hover:bg-green-700 px-3"
                        >
                          <PawPrint className="h-4 w-4" />
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
              Tem certeza que deseja marcar este pet como adotado?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPetId(null)}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmAdoption}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Confirmar Adoção
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
