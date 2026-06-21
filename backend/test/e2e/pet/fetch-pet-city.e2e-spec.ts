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

    await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
    });

    await createPet(app, {
      orgId: org.id,
      token,
      name: "Pingo",
    });

    const response = await request(app.server)
      .get(`/pets`)
      .query({ city: "Icapui", state: "CE" })
      .send();

    expect(response.body.pets).toHaveLength(2);
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
        }),
      ]),
    );
  });
});
