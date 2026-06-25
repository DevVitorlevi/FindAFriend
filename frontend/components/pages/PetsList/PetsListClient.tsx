"use client";

import { SearchPet } from "@/components/Search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Age, searchPet, Size, type Pet } from "@/services/pets";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Logo from "@/public/logo.png";
import Link from "next/link";

const AGE_LABEL: Record<Age, string> = {
  [Age.FILHOTE]: "Filhote",
  [Age.ADULTO]: "Adulto",
  [Age.IDOSO]: "Idoso",
};

const SIZE_LABEL: Record<Size, string> = {
  [Size.PEQUENO]: "Pequeno",
  [Size.MEDIO]: "Médio",
  [Size.GRANDE]: "Grande",
};

export default function SearchSection() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "420px",
          "--sidebar-width-icon": "120px",
          "--sidebar-foreground": "#ffffff",
          "--sidebar-accent": "#e04a4f",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "transparent",
          "--sidebar-ring": "#F4D35E",
        } as React.CSSProperties
      }
    >
      <SearchSectionInner />
    </SidebarProvider>
  );
}

function SearchSectionInner() {
  const { setOpenMobile } = useSidebar();
  const searchParams = useSearchParams();
  const city = searchParams.get("city") ?? "";
  const state = searchParams.get("state") ?? "";

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState<Age | "">("");
  const [size, setSize] = useState<Size | "">("");

  const fetchPets = useCallback(async () => {
    if (!city || !state) return;
    setLoading(true);
    try {
      const response = await searchPet({
        city,
        state,
        age: age || undefined,
        size: size || undefined,
        adopted: false,
      });
      setPets(response.pets ?? []);
    } catch (err) {
      console.error("Erro ao buscar pets:", err);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, [city, state, age, size]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return (
    <>
      <Sidebar collapsible="icon" className="border-none overflow-hidden">
        <SidebarHeader className="px-4 pt-6 pb-6 gap-6 bg-[#F15156] items-center">
          <div className="flex items-center justify-between w-full">
            <Link href={"/"}>
              <Image className="w-10 h-10" src={Logo} alt={""} />
            </Link>

            <SidebarTrigger className="text-white hover:text-white hover:bg-white/20" />
          </div>

          <div className="flex items-center gap-2 w-full group-data-[collapsible=icon]:hidden">
            <SearchPet onSearch={() => setOpenMobile(false)} />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 pt-4 bg-[#E44449]">
          <SidebarGroup>
            <div className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel className="text-white font-bold text-3xl h-auto mb-5">
                Filtros
              </SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-5 ml-2">
                <div className="flex flex-col gap-2">
                  <label className="text-white text-xl px-1">Idade</label>
                  <Select
                    value={age}
                    onValueChange={(v) => setAge(v === "all" ? "" : (v as Age))}
                  >
                    <SelectTrigger className="bg-white/20 border-none text-xl text-white font-semibold rounded-xl w-full p-7 focus:ring-0 focus:ring-offset-0 hover:bg-white/20 transition-colors data-placeholder:text-white">
                      <SelectValue placeholder="Todas as idades" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Age).map((a) => (
                        <SelectItem key={a} value={a}>
                          {AGE_LABEL[a]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-white text-xl px-1">
                    Porte do animal
                  </label>
                  <Select
                    value={size}
                    onValueChange={(v) =>
                      setSize(v === "all" ? "" : (v as Size))
                    }
                  >
                    <SelectTrigger className="bg-white/15 border-none text-xl text-white font-semibold rounded-xl w-full p-7 focus:ring-0 focus:ring-offset-0 hover:bg-white/20 transition-colors data-placeholder:text-white">
                      <SelectValue placeholder="Todos os portes" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Size).map((s) => (
                        <SelectItem key={s} value={s}>
                          {SIZE_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SidebarGroupContent>
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-[#FDECED]">
        <header className="flex items-center gap-2 px-6 py-4 md:hidden bg-[#E44449]">
          <SidebarTrigger className="text-white hover:text-white hover:bg-white/20" />
        </header>

        <main className="px-8 py-10">
          <p className="text-[#0D3B66] text-lg mb-8">
            Encontre <strong>{pets.length} amigos</strong> na sua cidade
          </p>

          {loading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#E44449]" />
            </div>
          )}

          {!loading && pets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
              <p className="text-[#0D3B66]/50 text-base">
                Nenhum pet encontrado com esses filtros.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setAge("");
                  setSize("");
                }}
                className="border-[#E44449] text-[#E44449] hover:bg-[#E44449]/10"
              >
                Limpar filtros
              </Button>
            </div>
          )}

          {!loading && pets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const router = useRouter();
  const coverImage = pet.images?.[0]?.url;

  return (
    <button
      onClick={() => router.push(`/pets/${pet.id}`)}
      className="w-full group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left hover:bg-[#0D3B66] hover:text-white"
    >
      <div className="relative h-48 w-full overflow-hidden bg-[#F4D35E]/20">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={pet.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[#0D3B66]/20 text-sm">
            Sem foto
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <span className="text-[#0D3B66] group-hover:text-white font-semibold text-base">
          {pet.name}
        </span>
        <div className="flex gap-1.5">
          <Badge variant="secondary" className="bg-[#E44449] text-white">
            {AGE_LABEL[pet.age]}
          </Badge>
          <Badge className="bg-[#0D3B66] text-white">{pet.size}</Badge>
        </div>
      </div>
    </button>
  );
}
