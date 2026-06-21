import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "../../utils/authenticate.js";
import { createPet } from "../../utils/create-pet.js";
import { setupE2E } from "@test/utils/setup-e2e.js";

describe("Get Pet (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to get pet", async () => {
    const { token, org } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
    });

    const response = await request(app.server).get(`/pet/${pet.id}`).send();

    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });
});
