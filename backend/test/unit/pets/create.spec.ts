import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import { InMemoryOrgsRepository } from "@test/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { CreatePetUseCase } from "@use-cases/pets/create.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let sut: CreatePetUseCase;

describe("Create Pet Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    petsRepository = new InMemoryPetsRepository(orgsRepository);
    sut = new CreatePetUseCase(petsRepository, orgsRepository);
  });

  it("should be able to create pet", async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapuí",
    });

    const { pet } = await sut.execute({
      name: "Simba",
      age: "ADULTO",
      description: "Gato Laranja Fofo",
      size: "GRANDE",
      orgId: org.id,
    });

    expect(pet.id).toEqual(expect.any(String));
    expect(pet.org_id).toEqual(org.id);
  });

  it("should not be able to create a pet with a non-existing organization", async () => {
    await expect(() =>
      sut.execute({
        name: "Simba",
        age: "ADULTO",
        description: "Gato Laranja Fofo",
        size: "GRANDE",
        orgId: "non-existing-org",
      }),
    ).rejects.toThrow(ResourceNotFound);
  });
});
