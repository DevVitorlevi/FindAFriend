import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { setupE2E } from "@test/utils/setup-e2e.js";
import { createPet } from "@test/utils/create-pet.js";
import { createAndAuthenticateOrg } from "@test/utils/authenticate.js";

describe("Delete Pet (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to delete a pet", async () => {
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
      .delete(`/pet/${pet.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(204);
  });

  it("should not be able to delete pet that not exists", async () => {
    const { token } = await createAndAuthenticateOrg(app, {
      city: "Icapui",
      state: "CE",
    });

    const response = await request(app.server)
      .delete(`/pet/"not-exist"`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(404);
  });
});
