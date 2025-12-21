import { InvalidCredentials } from "@/utils/errors/invalid-credentials.js"
import { InMemoryOrgsRepository } from "@/utils/test/in-memory/in-memory-orgs-repository.js"
import { hash } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"
import { LoginUseCase } from "./login.js"

let orgsRepository: InMemoryOrgsRepository
let sut: LoginUseCase

describe("Login Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new LoginUseCase(orgsRepository)
  })

  it("should be able to login org", async () => {
    await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash('123456', 6),
      cep: "62810-000",
      address: "Vila Serra de Peroba",
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui - CE",
      latitude: -4.7086,
      longitude: -37.3564
    })

    const { org } = await sut.execute({
      email: "sedema@email.com",
      password: "123456",
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.email).toBe("sedema@email.com")
  })

  it("should not be able to auth with wrong email", async () => {
    await expect(
      sut.execute({
        email: "sedema@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it("should not be able to auth with wrong password", async () => {
    await orgsRepository.create({
      name: "SEDEMA",
      email: "sedema@email.com",
      password_hash: await hash('123456', 6),
      cep: "62810-000",
      address: "Vila Serra de Peroba",
      whatsapp: "(88)99999-9999",
      state: "CE",
      city: "Icapui - CE",
      latitude: -4.7086,
      longitude: -37.3564
    })

    await expect(
      sut.execute({
        email: "sedema@email.com",
        password: "1234562",
      })
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })
})