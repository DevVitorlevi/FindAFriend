"use client";
import { SearchPet } from "@/components/Search";
import Pets from "@/public/OBJECTS.png";
import Image from "next/image";

export default function HomeSection() {
  return (
    <main className="bg-[#F15156] w-full min-h-screen flex flex-col overflow-x-hidden py-5">
      <div className="w-full px-5 sm:px-8 lg:px-10">
        <h2 className="font-semibold text-2xl sm:text-3xl text-white lg:text-5xl">
          FindAFriend
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center px-5 sm:px-8 lg:px-16 xl:px-20 w-full flex-1 gap-10 lg:gap-16 xl:gap-24 max-w-7xl mx-auto">
        <div className="text-white flex flex-col space-y-6 sm:space-y-8 lg:space-y-12 w-full lg:max-w-xl text-center lg:text-left items-center lg:items-start">
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Leve a felicidade para o seu lar
          </h1>
          <p className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl">
            Encontre o animal de estimação ideal para seu estilo de vida!
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 w-full max-w-sm sm:max-w-md">
          <Image
            src={Pets}
            alt="Imagens Ilustrativa de Animais"
            className="w-full h-auto"
            priority
          />
          <SearchPet />
        </div>
      </div>
    </main>
  );
}
