import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { setupE2E } from "@test/setup-e2e.js";

describe("Register Org (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to register a new org", async () => {
    const response = await request(app.server).post("/orgs").send({
      name: "ONG Amigos dos Animais",
      email: "contato@ongamigos.com",
      password: "senha123",
      whatsapp: "84999999999",
      state: "RN",
      city: "Natal",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to register with duplicate email", async () => {
    const orgData = {
      name: "ONG Amigos dos Animais",
      email: "contato@ongamigos.com",
      password: "senha123",
      whatsapp: "84999999999",
      state: "RN",
      city: "Natal",
    };

    await request(app.server).post("/orgs").send(orgData);

    const response = await request(app.server).post("/orgs").send(orgData);

    expect(response.status).toBe(409);
  });
});
