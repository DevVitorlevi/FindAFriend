import { ToggleAdoptedUseCase } from "@use-cases/pets/adopted.js";
import { hash } from "bcryptjs";
import { InMemoryOrgsRepository } from "@test/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetImagesRepository } from "@test/in-memory/in-memory-pets-images-repository.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let petImagesRepository: InMemoryPetImagesRepository;
let sut: ToggleAdoptedUseCase;

describe("Adopted Pet Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    petImagesRepository = new InMemoryPetImagesRepository();
    petsRepository = new InMemoryPetsRepository(
      orgsRepository,
      petImagesRepository,
    );
    sut = new ToggleAdoptedUseCase(petsRepository);
  });

  it("should be able to adopted pet ", async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
    });

    const createdPet = await petsRepository.create({
      name: "Rex",
      description: "Cachorro dócil",
      age: "ADULTO",
      size: "MEDIO",
      org_id: org.id,
    });

    await petImagesRepository.create({
      pet_id: createdPet.id,
      url: "https://example.com/image1.jpg",
    });

    await petImagesRepository.create({
      pet_id: createdPet.id,
      url: "https://example.com/image2.jpg",
    });

    const { pet } = await sut.execute({
      petId: createdPet.id,
    });

    expect(pet.adopted).toBe(true);
  });

  it("should be able to toggle adoption status back to false", async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
    });

    const createdPet = await petsRepository.create({
      name: "Frajola",
      description: "Gato brincalhão",
      age: "FILHOTE",
      size: "PEQUENO",
      org_id: org.id,
    });

    await sut.execute({ petId: createdPet.id });

    const { pet } = await sut.execute({
      petId: createdPet.id,
    });

    expect(pet.adopted).toBe(false);
  });

  it("should not be able to toggle adoption status of a non-existing pet", async () => {
    await expect(() =>
      sut.execute({
        petId: "non-existing-pet-id",
      }),
    ).rejects.toThrow(ResourceNotFound);
  });
});
