import { DeletePetUseCase } from "@/use-cases/pets/delete.js";
import { ResourceNotFound } from "@/utils/errors/resource-not-found.js";
import { InMemoryOrgsRepository } from "@test/in-memory/in-memory-orgs-repository.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let sut: DeletePetUseCase;
describe("Delete Pet Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    orgsRepository = new InMemoryOrgsRepository();
    sut = new DeletePetUseCase(petsRepository);
  });
  it("should be able to delete pet ", async () => {
    const org = await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash("123456", 6),
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapuí",
    });

    const pet = await petsRepository.create(org.id, {
      name: "Simba",
      age: "ADULTO",
      description: "Gato Laranja Fofo",
      size: "GRANDE",
    });
    expect(pet.id).toEqual(expect.any(String));

    await expect(sut.execute(pet.id)).resolves;
  });

  it("should not be able delete pet that not exists", async () => {
    await expect(sut.execute("not-exists")).rejects.toBeInstanceOf(
      ResourceNotFound,
    );
  });
});
