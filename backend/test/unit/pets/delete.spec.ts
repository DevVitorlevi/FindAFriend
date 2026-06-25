import { DeletePetUseCase } from "@/use-cases/pets/delete.js";
import { InMemoryPetsRepository } from "@test/in-memory/in-memory-pets-repository.js";
import { beforeEach, describe, expect, it } from "vitest";

let petsRepository: InMemoryPetsRepository;
let sut: DeletePetUseCase;
describe("Create Pet Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository();
    sut = new DeletePetUseCase(petsRepository);
  });
  it("should be able to delete pet ", async () => {
    const pet = await petsRepository.create({
      name: "Simba",
      age: "ADULTO",
      description: "Gato Laranja Fofo",
      size: "GRANDE",
      org_id: "org-1",
    });
    expect(pet.id).toEqual(expect.any(String));

    await expect(
      sut.execute({
        id: pet.id,
      }),
    ).resolves;
  });
});
