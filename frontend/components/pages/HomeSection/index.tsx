import { SearchPet } from "@/components/Search"
import Pets from "@/public/OBJECTS.png"
import Image from "next/image"

export default function HomeSection() {

  return (
    <>
      <main className="bg-[#F15156] w-screen min-h-screen flex flex-col py-5 overflow-y-auto">
        <div className="w-full px-5 lg:px-10">
          <h2 className="font-semibold text-3xl text-white lg:text-5xl">FindAFriend</h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center px-5 lg:px-20 w-full flex-1 gap-10 lg:gap-100">

          <div className="text-white flex flex-col space-y-8 lg:space-y-12 lg:max-w-xl">
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl">
              Leve a felicidade para o seu lar
            </h1>
            <p className="font-semibold text-xl md:text-2xl lg:text-3xl">
              Encontre o animal de estimação ideal para seu estilo de vida!
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 lg:gap-10 w-full lg:max-w-md">
            <Image
              src={Pets}
              alt="Imagens Ilustrativa de Animais"
              className="w-full h-auto"
            />
            <SearchPet />
          </div>
        </div>
      </main>
    </>
  )
}