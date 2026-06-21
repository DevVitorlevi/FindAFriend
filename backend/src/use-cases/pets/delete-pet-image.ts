import { cloudinary } from "@/app.js";
import type { PetImagesRepository } from "@/repositories/pets-images-repository-interface.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

interface DeletePetImageUseCaseRequest {
  imageId: string;
}

interface DeletePetImageUseCaseResponse {
  message: string;
}
export class DeletePetImageUseCase {
  constructor(private petImagesRepository: PetImagesRepository) {}

  async execute({
    imageId,
  }: DeletePetImageUseCaseRequest): Promise<DeletePetImageUseCaseResponse> {
    const image = await this.petImagesRepository.findById(imageId);

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

    await this.petImagesRepository.delete(imageId);

    return {
      message: "Image deleted successfully",
    };
  }
}
