"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPetById } from "@/services/pets";
import type { Pet, PetImage } from "@/services/pets";

const AGE_LABEL: Record<Pet["age"], string> = {
  FILHOTE: "Filhote",
  ADULTO: "Adulto",
  IDOSO: "Idoso",
};

const SIZE_LABEL: Record<Pet["size"], string> = {
  PEQUENO: "Pequeno",
  MEDIO: "Médio",
  GRANDE: "Grande",
};

interface PetDetailModalProps {
  petId: string | null;
  open: boolean;
  onClose: () => void;
}

function PetDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-14 rounded-xl shrink-0" />
        ))}
      </div>
      <Skeleton className="h-8 w-40 rounded-lg" />
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="h-px bg-border" />
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  );
}

function PetCarousel({ images, name }: { images: PetImage[]; name: string }) {
  const [active, setActive] = useState(0);

  const prev = useCallback(
    () => setActive((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length],
  );

  const next = useCallback(
    () => setActive((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length],
  );

  if (!images.length) {
    return (
      <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Sem fotos</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-muted group">
        <Image
          src={images[active].url}
          alt={`${name} - foto ${active + 1}`}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 640px) 100vw, 560px"
          priority={active === 0}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Foto anterior"
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm
                flex items-center justify-center shadow-md
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                hover:bg-white cursor-pointer
              "
            >
              <ChevronLeft className="w-4 h-4 text-[#0D3B66]" />
            </button>
            <button
              onClick={next}
              aria-label="Próxima foto"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm
                flex items-center justify-center shadow-md
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                hover:bg-white cursor-pointer
              "
            >
              <ChevronRight className="w-4 h-4 text-[#0D3B66]" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Ir para foto ${i + 1}`}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-200 cursor-pointer
                    ${i === active ? "bg-white scale-125" : "bg-white/50"}
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`
                relative h-14 w-14 shrink-0 rounded-xl overflow-hidden cursor-pointer
                transition-all duration-200 ring-2
                ${
                  i === active
                    ? "ring-[#F27006] scale-105"
                    : "ring-transparent opacity-60 hover:opacity-90"
                }
              `}
            >
              <Image
                src={img.url}
                alt={`${name} miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PetDetailModal({ petId, open, onClose }: PetDetailModalProps) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId || !open) return;

    let cancelled = false;

    async function fetchPet() {
      setLoading(true);
      setError(null);
      setPet(null);

      try {
        const { pet: fetched } = await getPetById({ petId: petId! });
        if (!cancelled) setPet(fetched);
      } catch {
        if (!cancelled) setError("Não foi possível carregar os dados do pet.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPet();
    return () => {
      cancelled = true;
    };
  }, [petId, open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="
          max-w-140 w-[calc(100vw-2rem)] max-h-[90vh]
          overflow-y-auto rounded-3xl p-0
          bg-white border-0 shadow-2xl
          focus:outline-none
        "
        aria-describedby="pet-detail-description"
      >
        <DialogTitle className="sr-only">
          {pet ? `Detalhes de ${pet.name}` : "Carregando pet..."}
        </DialogTitle>

        <button
          onClick={onClose}
          aria-label="Fechar"
          className="
            absolute top-4 right-4 z-10
            w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md
            flex items-center justify-center
            hover:bg-white transition-colors duration-150
            cursor-pointer
          "
        >
          <X className="w-4 h-4 text-[#0D3B66]" />
        </button>

        <div className="p-5 sm:p-6 flex flex-col gap-5">
          {loading && <PetDetailSkeleton />}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-[#0D3B66] font-medium">{error}</p>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-[#0D3B66] text-[#0D3B66]"
              >
                Fechar
              </Button>
            </div>
          )}

          {!loading && pet && (
            <>
              <PetCarousel
                key={pet.id}
                images={pet.images ?? []}
                name={pet.name}
              />

              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-[#0D3B66] leading-tight">
                  {pet.name}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-[#F27006]/10 text-[#F27006] border-[#F27006]/20 font-medium hover:bg-[#F27006]/10"
                  >
                    {AGE_LABEL[pet.age]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-[#0D3B66]/10 text-[#0D3B66] border-[#0D3B66]/20 font-medium hover:bg-[#0D3B66]/10"
                  >
                    Porte {SIZE_LABEL[pet.size]}
                  </Badge>
                  {pet.adopted && (
                    <Badge variant="secondary" className="font-medium">
                      Adotado
                    </Badge>
                  )}
                </div>
              </div>

              <p
                id="pet-detail-description"
                className="text-[#0D3B66]/70 text-sm leading-relaxed"
              >
                {pet.description}
              </p>

              <div className="h-px bg-[#0D3B66]/10" />

              {pet.org && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F27006] flex items-center justify-center shrink-0">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[#0D3B66] text-sm leading-tight">
                        {pet.org.name}
                      </span>
                      <span className="flex items-center gap-1 text-[#0D3B66]/60 text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {pet.org.city} - {pet.org.state}
                      </span>
                    </div>
                  </div>

                  <div
                    className="
                      flex items-center gap-2.5 w-fit
                      px-4 py-2.5 rounded-xl
                      border border-[#0D3B66]/20
                      text-[#0D3B66] text-sm font-medium
                      select-all
                    "
                  >
                    <Phone className="w-4 h-4 shrink-0 text-[#0D3B66]/60" />
                    {pet.org.whatsapp}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
