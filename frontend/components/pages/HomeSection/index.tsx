import { SearchPet } from "@/components/Search"
import Pets from "@/public/OBJECTS.png"
import Image from "next/image"

export default function HomeSection() {

  return (
    <>
      <main className="bg-[#F15156] w-screen h-screen px-50 py-50 flex justify-between">
        <div className="text-white flex flex-col space-y-20 ">
          <h2 className="font-semibold text-4xl">FindAFriend</h2>
          <h1 className="font-bold text-7xl">Leve <br />
            a felicidade <br />
            para o seu lar</h1>
          <p className="font-semibold text-justify text-3xl" >Encontre o animal de estimação ideal <br />
            para seu estilo de vida!</p>
        </div>

        <div className="flex flex-col items-end space-y-20">
          <Image src={Pets} alt="Imagens Ilustrativa de Animais" className="mt-5" />
          <SearchPet />
        </div>
      </main>
    </>
  )
}