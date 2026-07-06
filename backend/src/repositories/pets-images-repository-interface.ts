import type {
  CreatePetImageInput,
  CreatePetImageOutput,
  DeletePetImageParams,
  FindByIdPetImageOutput,
  FindByIdPetImageParams,
  FindManyPetImageOutput,
  FindManyPetImageParams,
} from "./DTOs/pet-image.js";

export interface PetImagesRepository {
  create(data: CreatePetImageInput): Promise<CreatePetImageOutput>;
  findManyByPetId(
    petId: FindManyPetImageParams,
  ): Promise<FindManyPetImageOutput[]>;
  findById(
    petImageId: FindByIdPetImageParams,
  ): Promise<FindByIdPetImageOutput | null>;
  delete(petImageId: DeletePetImageParams): Promise<void>;
}
