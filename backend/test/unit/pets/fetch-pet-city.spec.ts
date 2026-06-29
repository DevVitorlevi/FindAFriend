import { hash } from "bcryptjs";
import { InMemoryOrgsRepository } from "@test/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetImagesRepository } from "@test/in-memory/in-memory-pets-images-repository.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchPetCityUseCase } from "@use-cases/pets/fetch-pet-city.js";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let petImagesRepository: InMemoryPetImagesRepository;
let sut: FetchPetCityUseCase;

describe("Fetch Pet City Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    petImagesRepository = new InMemoryPetImagesRepository();
    petsRepository = new InMemoryPetsRepository(
      orgsRepository,
      petImagesRepository,
    );
    sut = new FetchPetCityUseCase(petsRepository);
  });

  it("should be able to fetch pets by city", async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui",
    });

    await petsRepository.create(org.id, {
      name: "Simba",
      age: "ADULTO",
      description: "Gato Laranja Fofo",
      size: "GRANDE",
    });

    await petsRepository.create(org.id, {
      name: "Bolinha",
      age: "FILHOTE",
      description: "Cachorro branco pequeno",
      size: "PEQUENO",
    });

    const pets = await sut.execute({ city: "Icapui", state: "CE" });

    expect(pets).toHaveLength(2);
  });

  it("should not return pets from a different city", async () => {
    const orgFortaleza = await orgsRepository.create({
      name: "ONG Fortaleza",
      email: "ong@fortaleza.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(85)99999-9999",
      state: "CE",
      city: "Fortaleza",
    });

    const orgIcapui = await orgsRepository.create({
      name: "ONG Icapui",
      email: "ong@icapui.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)98888-8888",
      state: "CE",
      city: "Icapui",
    });

    await petsRepository.create(orgFortaleza.id, {
      name: "Rex",
      age: "ADULTO",
      description: "Cachorro grande",
      size: "GRANDE",
    });

    await petsRepository.create(orgIcapui.id, {
      name: "Simba",
      age: "ADULTO",
      description: "Gato laranja",
      size: "MEDIO",
    });

    const pets = await sut.execute({ city: "Icapui", state: "CE" });

    expect(pets).toHaveLength(1);
    expect(pets[0].name).toBe("Simba");
  });

  it("should not return pets from a different state with same city name", async () => {
    const orgCE = await orgsRepository.create({
      name: "ONG CE",
      email: "ong@ce.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Russas",
    });

    const orgSP = await orgsRepository.create({
      name: "ONG SP",
      email: "ong@sp.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(11)99999-9999",
      state: "SP",
      city: "Russas",
    });

    await petsRepository.create(orgCE.id, {
      name: "Mel",
      age: "FILHOTE",
      description: "Cachorrinha caramelo",
      size: "PEQUENO",
    });

    await petsRepository.create(orgSP.id, {
      name: "Thor",
      age: "ADULTO",
      description: "Cachorro preto grande",
      size: "GRANDE",
    });

    const pets = await sut.execute({ city: "Russas", state: "CE" });

    expect(pets).toHaveLength(1);
    expect(pets[0].name).toBe("Mel");
  });

  it("should return empty array when no pets exist in city", async () => {
    const pets = await sut.execute({ city: "CidadeSemPets", state: "CE" });

    expect(pets).toHaveLength(0);
  });

  it("should return pets from multiple orgs in the same city", async () => {
    const org1 = await orgsRepository.create({
      name: "ONG Alpha",
      email: "alpha@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)91111-1111",
      state: "CE",
      city: "Mossoró",
    });

    const org2 = await orgsRepository.create({
      name: "ONG Beta",
      email: "beta@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)92222-2222",
      state: "CE",
      city: "Mossoró",
    });

    await petsRepository.create(org1.id, {
      name: "Pingo",
      age: "FILHOTE",
      description: "Gato preto",
      size: "PEQUENO",
    });

    await petsRepository.create(org2.id, {
      name: "Fofão",
      age: "ADULTO",
      description: "Cachorro vira-lata",
      size: "MEDIO",
    });

    const pets = await sut.execute({ city: "Mossoró", state: "CE" });

    expect(pets).toHaveLength(2);
  });

  it("should include pet images in the response", async () => {
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
      pet_id: createdPet.id,
      url: "https://example.com/image1.jpg",
    });

    await petImagesRepository.create({
      pet_id: createdPet.id,
      url: "https://example.com/image2.jpg",
    });

    const pets = await sut.execute({ city: "Icapui", state: "CE" });

    expect(pets[0].images).toHaveLength(2);
    expect(pets[0].images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: "https://example.com/image1.jpg" }),
        expect.objectContaining({ url: "https://example.com/image2.jpg" }),
      ]),
    );
  });
});
