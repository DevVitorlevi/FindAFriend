import { cloudinary } from "@/app.js";
import type { DeletePetImageParams } from "@/repositories/DTOs/pet-image.js";
import type { PetImagesRepository } from "@/repositories/pets-images-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

export class DeletePetImageUseCase {
  constructor(private petImagesRepository: PetImagesRepository) {}

  async execute({ petImageId }: DeletePetImageParams): Promise<void> {
    const image = await this.petImagesRepository.findById({ petImageId });

    if (!image) {
      throw new ResourceNotFound();
    }

    const urlParts = image.url.split("/");
    const filename = urlParts[urlParts.length - 1].split(".")[0];
    const folder = urlParts.slice(-3, -1).join("/");
    const publicId = `${folder}/${filename}`;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }

    await this.petImagesRepository.delete({ petImageId });
  }
}
