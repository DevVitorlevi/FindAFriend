import { DeletePetImageUseCase } from "@use-cases/pets/delete-pet-image.js";
import { hash } from "bcryptjs";
import { InMemoryOrgsRepository } from "@test/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetImagesRepository } from "@test/in-memory/in-memory-pets-images-repository.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { beforeEach, describe, expect, it } from "vitest";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let petImagesRepository: InMemoryPetImagesRepository;
let sut: DeletePetImageUseCase;
describe(" Delete Image Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    petImagesRepository = new InMemoryPetImagesRepository();
    petsRepository = new InMemoryPetsRepository(
      orgsRepository,
      petImagesRepository,
    );
    sut = new DeletePetImageUseCase(petImagesRepository);
  });

  it("should be able to delete pet image", async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
    });

    const createdPet = await petsRepository.create(org.id, {
      name: "Simba",
      age: "ADULTO",
      description: "Gato Laranja Fofo",
      size: "GRANDE",
    });

    const image1 = await petImagesRepository.create({
      petId: createdPet.id,
      url: "https://example.com/image1.jpg",
    });

    await petImagesRepository.create({
      petId: createdPet.id,
      url: "https://example.com/image2.jpg",
    });

    await expect(
      sut.execute({
        petImageId: image1.id,
      }),
    ).resolves.toBeUndefined();
    const remainingImages = await petImagesRepository.findManyByPetId({
      petId: createdPet.id,
    });

    expect(remainingImages).toHaveLength(1);
    expect(remainingImages[0].url).toBe("https://example.com/image2.jpg");
  });
});
