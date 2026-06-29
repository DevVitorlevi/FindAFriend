import type { Org } from "@/@types/org.js";
import type { PetImage } from "@/@types/pet-image.js";
import type { Pet } from "@/@types/pet.js";

export interface CreatePetInput {
  name: string;
  description: string;
  age: "FILHOTE" | "ADULTO" | "IDOSO";
  size: "PEQUENO" | "MEDIO" | "GRANDE";
}

export interface CreatePetParams {
  orgId: string;
}

export interface CreatePetOutput {
  id: string;
  name: string;
  description: string;
  age: "FILHOTE" | "ADULTO" | "IDOSO";
  size: "PEQUENO" | "MEDIO" | "GRANDE";
  org_id: string;
}

export interface FindPetByIdParams {
  petId: string;
}

export interface FindPetByIdOutput {
  pet: Pet & {
    org: Org;
    images: PetImage[];
  };
}

export interface FindManyByCityParams {
  state: string;
  city: string;
  age?: "FILHOTE" | "ADULTO" | "IDOSO";
  size?: "PEQUENO" | "MEDIO" | "GRANDE";
}

export interface ToggleAdoptedOutput {
  id: string;
  name: string;
  description: string;
  age: "FILHOTE" | "ADULTO" | "IDOSO";
  size: "PEQUENO" | "MEDIO" | "GRANDE";
  org_id: string;
  adopted: boolean;
}

export interface UpdatePetInput {
  name?: string;
  description?: string;
  age?: "FILHOTE" | "ADULTO" | "IDOSO";
  size?: "PEQUENO" | "MEDIO" | "GRANDE";
}
export interface UpdatePetOutput {
  id: string;
  name: string;
  description: string;
  age: "FILHOTE" | "ADULTO" | "IDOSO";
  size: "PEQUENO" | "MEDIO" | "GRANDE";
  org_id: string;
}
