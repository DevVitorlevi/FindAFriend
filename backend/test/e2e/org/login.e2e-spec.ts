import { app } from "@/app.js";
import request from "supertest";
import { createOrg } from "@test/utils/create-org.js";
import { beforeEach, describe, expect, it } from "vitest";
import { setupE2E } from "@test/setup-e2e.js";

describe("Login Org (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to login a org", async () => {
    const { credentials } = await createOrg(app, {
      email: "contato@ongamigos.com",
      password: "senha123",
    });

    const response = await request(app.server).post("/sessions").send({
      email: credentials.email,
      password: credentials.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    );
  });

  it("should note be able to login with wrong password", async () => {
    const { credentials } = await createOrg(app, {
      email: "contato@ongamigos.com",
    });

    const response = await request(app.server).post("/sessions").send({
      email: credentials.email,
      password: "senha1232",
    });

    expect(response.status).toBe(400);
  });
});
