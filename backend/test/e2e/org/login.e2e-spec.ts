import { app } from "@/app.js";
import request from "supertest";
import { createOrg } from "@test/utils/create-org.js";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { resetDatabase } from "../../utils/reset-database.js";

describe("Login Org (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await resetDatabase();
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
        token: expect.any(String),
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
