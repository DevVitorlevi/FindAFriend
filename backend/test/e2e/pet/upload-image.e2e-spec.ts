import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "../../utils/authenticate.js";
import {
  createFakeImage,
  createFakeImages,
} from "../../utils/create-fake-image.js";
import { createPet } from "../../utils/create-pet.js";
import { setupE2E } from "@test/utils/setup-e2e.js";

describe("Upload Pet Images (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });

  it("should be able to upload images for a pet", async () => {
    const { token, org } = await createAndAuthenticateOrg(app);

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
    });

    const imageBuffer = createFakeImage();

    const response = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer, "test-image.png");

    expect(response.status).toBe(201);
    expect(response.body.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          url: expect.stringContaining("cloudinary.com"),
          pet_id: pet.id,
        }),
      ]),
    );
  });

  it("should be able to upload multiple images", async () => {
    const { token, org } = await createAndAuthenticateOrg(app);

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Miau",
    });

    const images = createFakeImages(2);

    const uploadRequest = request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token}`);

    images.forEach((buffer, index) => {
      uploadRequest.attach("file", buffer, `test-image-${index}.png`);
    });

    const response = await uploadRequest;

    expect(response.status).toBe(201);
    expect(response.body.images).toHaveLength(2);
    expect(response.body.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: expect.stringContaining("cloudinary.com"),
        }),
      ]),
    );
  });

  it("should not upload images without authentication", async () => {
    const { org } = await createAndAuthenticateOrg(app);

    const { pet } = await createPet(app, {
      orgId: org.id,
      token: await createAndAuthenticateOrg(app).then((r) => r.token),
    });

    const imageBuffer = createFakeImage();

    const response = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .attach("file", imageBuffer, "test-image.png");

    expect(response.status).toBe(401);
  });
});
