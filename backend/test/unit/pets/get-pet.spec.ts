import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import { hash } from "bcryptjs";
import { InMemoryOrgsRepository } from "@test/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetImagesRepository } from "@test/in-memory/in-memory-pets-images-repository.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { GetPetDetailsUseCase } from "@/use-cases/pets/get-pet-by-id.js";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let petImagesRepository: InMemoryPetImagesRepository;
let sut: GetPetDetailsUseCase;

describe("Get Pet Details Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    petImagesRepository = new InMemoryPetImagesRepository();
    petsRepository = new InMemoryPetsRepository(
      orgsRepository,
      petImagesRepository,
    );
    sut = new GetPetDetailsUseCase(petsRepository);
  });

  it("should be able to get pet details", async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
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

    await petImagesRepository.create({
      pet_id: createdPet.pet.id,
      url: "https://example.com/image1.jpg",
    });

    await petImagesRepository.create({
      pet_id: createdPet.pet.id,
      url: "https://example.com/image2.jpg",
    });

    const pet = await sut.execute({
      petId: createdPet.pet.id,
    });

    expect(pet.id).toBe(createdPet.pet.id);
    expect(pet.name).toBe("Simba");
    expect(pet.org.name).toBe("SEDEMA");
    expect(pet.org.whatsapp).toBe("(88)99999-9999");
    expect(pet.images).toHaveLength(2);
    expect(pet.images[0].url).toBe("https://example.com/image1.jpg");
  });

  it("should not be able to get details of non-existing pet", async () => {
    await expect(() =>
      sut.execute({
        petId: "non-existing-pet-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
