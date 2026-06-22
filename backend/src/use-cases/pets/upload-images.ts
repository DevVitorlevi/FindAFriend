import { cloudinary } from "@/lib/cloudinary.js";
import type { PetImagesRepository } from "@/repositories/pets-images-repository-interface.js";
import type { PetsRepository } from "@/repositories/pets-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import type { PetImage } from "@generated/prisma/browser.js";

interface UploadPetImagesUseCaseRequest {
  petId: string;
  images: Buffer[];
}

interface UploadPetImagesUseCaseResponse {
  images: PetImage[];
}

export class UploadPetImagesUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private petImagesRepository: PetImagesRepository,
  ) {}

  async execute({
    petId,
    images,
  }: UploadPetImagesUseCaseRequest): Promise<UploadPetImagesUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId);

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
        pet_id: petId,
        url: uploadResult.secure_url,
      });

      uploadedImages.push(image);
    }

    return { images: uploadedImages };
  }
}
