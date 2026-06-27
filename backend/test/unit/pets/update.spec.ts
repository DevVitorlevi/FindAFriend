import { UpdatePetUseCase } from "@/use-cases/pets/update.js";
import { InMemoryOrgsRepository } from "@test/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

describe("Update Pet", () => {
  let orgsRepository: InMemoryOrgsRepository;
  let petsRepository: InMemoryPetsRepository;
  let sut: UpdatePetUseCase;

  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    petsRepository = new InMemoryPetsRepository(orgsRepository);
    sut = new UpdatePetUseCase(petsRepository);
  });

  async function makeOrg() {
    return orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
    });
  }

  async function makePet(orgId: string) {
    const org = await makeOrg();
    return petsRepository.create(org.id, {
      name: "Rex",
      description: "Cachorro dócil",
      age: "ADULTO",
      size: "MEDIO",
    });
  }

  it("should be able to update a pet successfully (all fields)", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.pet.id, {
      name: "Simba",
      description: "Gato Laranja, docil, fofo e gordinho",
      age: "ADULTO",
      size: "GRANDE",
    });

    expect(result.pet.id).toEqual(createdPet.pet.id);
    expect(result.pet.name).toEqual("Simba");
    expect(result.pet.description).toEqual(
      "Gato Laranja, docil, fofo e gordinho",
    );
    expect(result.pet.age).toEqual("ADULTO");
    expect(result.pet.size).toEqual("GRANDE");
  });

  it("should be able to update only the name", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.pet.id, { name: "Bolinha" });

    expect(result.pet.name).toEqual("Bolinha");
    expect(result.pet.description).toEqual(createdPet.pet.description);
    expect(result.pet.age).toEqual(createdPet.pet.age);
    expect(result.pet.size).toEqual(createdPet.pet.size);
  });

  it("should be able to update only the description", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.pet.id, {
      description: "Cachorro bravo, cuidado!",
    });

    expect(result.pet.description).toEqual("Cachorro bravo, cuidado!");
    expect(result.pet.name).toEqual(createdPet.pet.name);
    expect(result.pet.age).toEqual(createdPet.pet.age);
    expect(result.pet.size).toEqual(createdPet.pet.size);
  });

  it("should be able to update only the age", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.pet.id, { age: "FILHOTE" });

    expect(result.pet.age).toEqual("FILHOTE");
    expect(result.pet.name).toEqual(createdPet.pet.name);
    expect(result.pet.age).toEqual(createdPet.pet.age);
    expect(result.pet.size).toEqual(createdPet.pet.size);
  });

  it("should be able to update only the size", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.pet.id, { size: "PEQUENO" });

    expect(result.pet.size).toEqual("PEQUENO");
    expect(result.pet.name).toEqual(createdPet.pet.name);
    expect(result.pet.age).toEqual(createdPet.pet.age);
    expect(result.pet.size).toEqual(createdPet.pet.size);
  });

  it("should throw ResourceNotFound when pet does not exist", async () => {
    await expect(
      sut.execute("non-existent-id", { name: "Ghost" }),
    ).rejects.toThrow(ResourceNotFound);
  });
});
