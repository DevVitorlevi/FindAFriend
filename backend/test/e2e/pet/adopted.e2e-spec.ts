import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "../../utils/authenticate.js";
import { createPet } from "../../utils/create-pet.js";
import { setupE2E } from "@test/setup-e2e.js";

describe("Adopted Pet (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to adopted pet", async () => {
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
      .patch(`/pet/${pet.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.status).toBe(204);
  });
});
