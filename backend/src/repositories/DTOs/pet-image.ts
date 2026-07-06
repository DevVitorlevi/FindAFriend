import type { PetImage } from "@/@types/pet-image.js";

export interface CreatePetImageInput {
  id?: string;
  url: string;
  petId: string;
}

export interface CreatePetImageOutput {
  id: string;
  url: string;
  petId: string;
  create_at: Date;
}
export interface FindManyPetImageParams {
  petId: string;
}

export interface FindManyPetImageOutput {
  id: string;
  url: string;
  petId: string;
  create_at: Date;
}

export interface FindByIdPetImageParams {
  petImageId: string;
}

export interface FindByIdPetImageOutput {
  id: string;
  url: string;
  petId: string;
  create_at: Date;
}

export interface DeletePetImageParams {
  petImageId: string;
}

export interface UploadPetImagesInput {
  petId: string;
  images: Buffer[];
}

export interface UploadPetImagesOutput {
  images: PetImage[];
}
