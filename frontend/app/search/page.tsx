import { Metadata } from "next";
import SearchSection from "@/components/pages/PetsList/PetsListClient";

export const metadata: Metadata = {
  title: "Encontre um amigo | FindAFriend",
  description:
    "Encontre pets disponíveis para adoção na sua cidade. Filtre por idade, porte e localização.",
};

export default function SearchPet() {
  return <SearchSection />;
}
