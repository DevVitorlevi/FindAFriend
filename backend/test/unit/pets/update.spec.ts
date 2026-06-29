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

    const result = await sut.execute(createdPet.id, {
      name: "Simba",
      description: "Gato Laranja, docil, fofo e gordinho",
      age: "ADULTO",
      size: "GRANDE",
    });

    expect(result.id).toEqual(createdPet.id);
    expect(result.name).toEqual("Simba");
    expect(result.description).toEqual("Gato Laranja, docil, fofo e gordinho");
    expect(result.age).toEqual("ADULTO");
    expect(result.size).toEqual("GRANDE");
  });

  it("should be able to update only the name", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.id, { name: "Bolinha" });

    expect(result.name).toEqual("Bolinha");
    expect(result.description).toEqual(createdPet.description);
    expect(result.age).toEqual(createdPet.age);
    expect(result.size).toEqual(createdPet.size);
  });

  it("should be able to update only the description", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.id, {
      description: "Cachorro bravo, cuidado!",
    });

    expect(result.description).toEqual("Cachorro bravo, cuidado!");
    expect(result.name).toEqual(createdPet.name);
    expect(result.age).toEqual(createdPet.age);
    expect(result.size).toEqual(createdPet.size);
  });

  it("should be able to update only the age", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.id, { age: "FILHOTE" });

    expect(result.age).toEqual("FILHOTE");
    expect(result.name).toEqual(createdPet.name);
    expect(result.age).toEqual(createdPet.age);
    expect(result.size).toEqual(createdPet.size);
  });

  it("should be able to update only the size", async () => {
    const org = await makeOrg();
    const createdPet = await makePet(org.id);

    const result = await sut.execute(createdPet.id, { size: "PEQUENO" });

    expect(result.size).toEqual("PEQUENO");
    expect(result.name).toEqual(createdPet.name);
    expect(result.age).toEqual(createdPet.age);
    expect(result.size).toEqual(createdPet.size);
  });

  it("should throw ResourceNotFound when pet does not exist", async () => {
    await expect(
      sut.execute("non-existent-id", { name: "Ghost" }),
    ).rejects.toThrow(ResourceNotFound);
  });
});
