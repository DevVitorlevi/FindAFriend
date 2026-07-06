import type { PetImage } from "@/@types/pet-image.js";
import { cloudinary } from "@/lib/cloudinary.js";
import type {
  UploadPetImagesInput,
  UploadPetImagesOutput,
} from "@/repositories/DTOs/pet-image.js";
import type { PetImagesRepository } from "@/repositories/pets-images-repository-interface.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

export class UploadPetImagesUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private petImagesRepository: PetImagesRepository,
  ) {}

  async execute({
    petId,
    images,
  }: UploadPetImagesInput): Promise<UploadPetImagesOutput> {
    const pet = await this.petsRepository.findById({ petId });

    if (!pet) {
      throw new ResourceNotFound();
    }

    const uploadedImages: PetImage[] = [];

    for (const imageBuffer of images) {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "findafriend/pets",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(imageBuffer);
      });

      const image = await this.petImagesRepository.create({
        petId,
        url: uploadResult.secure_url,
      });

      uploadedImages.push({
        id: image.id,
        url: image.url,
        pet_id: image.petId,
        created_at: image.create_at,
      });
    }

    return { images: uploadedImages };
  }
}
