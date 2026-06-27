import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "../../utils/authenticate.js";
import { createPet } from "../../utils/create-pet.js";
import { setupE2E } from "@test/utils/setup-e2e.js";

describe("Fetch Pet City (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to fetch pets with city", async () => {
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    await createPet(app, { orgId: org.id, token, name: "Rex" });
    await createPet(app, { orgId: org.id, token, name: "Pingo" });

    const response = await request(app.server)
      .get(`/pets`)
      .query({ city: "Icapui", state: "CE" })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.pets).toHaveLength(2);
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(String) }),
      ]),
    );
  });

  it("should not return pets from a different city", async () => {
    const { token: tokenFortaleza, org: orgFortaleza } =
      await createAndAuthenticateOrg(app, { city: "Fortaleza", state: "CE" });

    const { token: tokenIcapui, org: orgIcapui } =
      await createAndAuthenticateOrg(app, { city: "Icapui", state: "CE" });

    await createPet(app, {
      orgId: orgFortaleza.id,
      token: tokenFortaleza,
      name: "Thor",
    });
    await createPet(app, {
      orgId: orgIcapui.id,
      token: tokenIcapui,
      name: "Simba",
    });

    const response = await request(app.server)
      .get("/pets")
      .query({ city: "Icapui", state: "CE" })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets[0]).toMatchObject({ name: "Simba" });
  });

  it("should not return pets from a different state with the same city name", async () => {
    const { token: tokenCE, org: orgCE } = await createAndAuthenticateOrg(app, {
      city: "Russas",
      state: "CE",
    });

    const { token: tokenSP, org: orgSP } = await createAndAuthenticateOrg(app, {
      city: "Russas",
      state: "SP",
    });

    await createPet(app, { orgId: orgCE.id, token: tokenCE, name: "Mel" });
    await createPet(app, { orgId: orgSP.id, token: tokenSP, name: "Bob" });

    const response = await request(app.server)
      .get("/pets")
      .query({ city: "Russas", state: "CE" })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets[0]).toMatchObject({ name: "Mel" });
  });

  it("should return empty array when no pets exist in city", async () => {
    const response = await request(app.server)
      .get("/pets")
      .query({ city: "CidadeSemPets", state: "CE" })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.pets).toHaveLength(0);
  });

  it("should return pets from multiple orgs in the same city", async () => {
    const { token: token1, org: org1 } = await createAndAuthenticateOrg(app, {
      city: "Mossoro",
      state: "RN",
    });

    const { token: token2, org: org2 } = await createAndAuthenticateOrg(app, {
      city: "Mossoro",
      state: "RN",
    });

    await createPet(app, { orgId: org1.id, token: token1, name: "Fofão" });
    await createPet(app, { orgId: org2.id, token: token2, name: "Preta" });

    const response = await request(app.server)
      .get("/pets")
      .query({ city: "Mossoro", state: "RN" })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.pets).toHaveLength(2);
  });
});
