import request from "supertest";
import { createAndAuthenticateOrg } from "@test/utils/authenticate.js";
import { beforeEach, describe, expect, it } from "vitest";
import { setupE2E } from "@test/setup-e2e.js";

describe("Create Pet (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to create pet", async () => {
    const { token, org } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
      .post(`/pets/${org.id}/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Sol",
        description: "Gata Laranja muito Fofa",
        age: "FILHOTE",
        size: "PEQUENO",
      });

    expect(response.status).toBe(201);
  });
});
