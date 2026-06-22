import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "../../utils/authenticate.js";
import { createPet } from "../../utils/create-pet.js";
import { setupE2E } from "@test/utils/setup-e2e.js";

describe("Update Pet (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to update pet", async () => {
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
    });

    const response = await request(app.server)
      .put(`/pet/${pet.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Simba",
        description: "Gato Laranja, fofo, docil e carinhoso",
        age: "ADULTO",
        size: "GRANDE",
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.pet.pet).toBeDefined();
    expect(response.body.pet.pet.id).toEqual(pet.id);
    expect(response.body.pet.pet.name).toEqual("Simba");
    expect(response.body.pet.pet.description).toEqual(
      "Gato Laranja, fofo, docil e carinhoso",
    );
  });

  it("should be able to update only some fields (partial update)", async () => {
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
      age: "FILHOTE",
      size: "PEQUENO",
    });

    const response = await request(app.server)
      .put(`/pet/${pet.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bolinha" });

    expect(response.statusCode).toEqual(200);
    expect(response.body.pet.pet.name).toEqual("Bolinha");
    // campos não enviados devem permanecer os originais
    expect(response.body.pet.pet.age).toEqual("FILHOTE");
    expect(response.body.pet.pet.size).toEqual("PEQUENO");
  });

  it("should not be able to update a pet without authentication", async () => {
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
    });

    const response = await request(app.server)
      .put(`/pet/${pet.id}`)
      .send({ name: "Simba" });

    expect(response.statusCode).toEqual(401);
  });

  it("should not be able to update a pet that belongs to another org", async () => {
    const { token: tokenA, org: orgA } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const { token: tokenB } = await createAndAuthenticateOrg(app, {
      city: "Fortaleza",
      state: "CE",
    });

    const { pet } = await createPet(app, {
      orgId: orgA.id,
      token: tokenA,
      name: "Rex",
    });

    const response = await request(app.server)
      .put(`/pet/${pet.id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ name: "Invasor" });

    expect(response.statusCode).toEqual(403);
  });

  it("should return 404 when trying to update a non-existent pet", async () => {
    const { token } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const response = await request(app.server)
      .put("/pet/non-existent-id")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Ghost" });

    expect(response.statusCode).toEqual(404);
  });

  it("should return 400 when sending invalid field values", async () => {
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
    });

    const response = await request(app.server)
      .put(`/pet/${pet.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        age: "VELHISSIMO",
        size: "GIGANTE",
      });

    expect(response.statusCode).toEqual(400);
  });
});
