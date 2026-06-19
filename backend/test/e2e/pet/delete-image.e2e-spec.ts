import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { setupE2E } from "@test/setup-e2e.js";
import { createAndAuthenticateOrg } from "../../utils/authenticate.js";
import { createPet } from "../../utils/create-pet.js";
import { createFakeImage } from "../../utils/create-fake-image.js";

describe("Delete Pet Image (e2e)", () => {
  let app: Awaited<ReturnType<typeof setupE2E>>;

  beforeEach(async () => {
    app = await setupE2E();
  });
  it("should be able to delete a pet image", async () => {
    const { token, org } = await createAndAuthenticateOrg(app);

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
      name: "Rex",
    });

    const imageBuffer = createFakeImage();

    const uploadResponse = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer, "test-image.png");

    expect(uploadResponse.status).toBe(201);

    const imageId = uploadResponse.body.images[0].id;

    const deleteResponse = await request(app.server)
      .delete(`/image/${imageId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(204);

    const petResponse = await request(app.server).get(`/pet/${pet.id}`);

    const petImages = petResponse.body.pet.images || [];
    const imageStillExists = petImages.some((img: any) => img.id === imageId);

    expect(imageStillExists).toBe(false);
  });

  it("should not delete image without authentication", async () => {
    const { token, org } = await createAndAuthenticateOrg(app);

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
    });

    const imageBuffer = createFakeImage();

    const uploadResponse = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer, "test-image.png");

    const imageId = uploadResponse.body.images[0].id;

    const deleteResponse = await request(app.server).delete(
      `/image/${imageId}`,
    );

    expect(deleteResponse.status).toBe(401);
  });

  it("should not delete image from another org", async () => {
    const { token: token1, org: org1 } = await createAndAuthenticateOrg(app, {
      email: "org1@test.com",
    });

    const { pet } = await createPet(app, {
      orgId: org1.id,
      token: token1,
      name: "Pet da Org 1",
    });

    const imageBuffer = createFakeImage();

    const uploadResponse = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token1}`)
      .attach("file", imageBuffer, "test-image.png");

    const imageId = uploadResponse.body.images[0].id;

    const { token: token2 } = await createAndAuthenticateOrg(app, {
      email: "org2@test.com",
    });

    const deleteResponse = await request(app.server)
      .delete(`/image/${imageId}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(deleteResponse.status).toBe(403);
  });

  it("should be able to delete multiple images", async () => {
    const { token, org } = await createAndAuthenticateOrg(app);

    const { pet } = await createPet(app, {
      orgId: org.id,
      token,
    });

    const imageBuffer1 = createFakeImage();
    const imageBuffer2 = createFakeImage();
    const imageBuffer3 = createFakeImage();

    const upload1 = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer1, "image-1.png");

    const upload2 = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer2, "image-2.png");

    const upload3 = await request(app.server)
      .post(`/pet/${pet.id}/images`)
      .set("Authorization", `Bearer ${token}`)
      .attach("file", imageBuffer3, "image-3.png");

    const imageId1 = upload1.body.images[0].id;
    const imageId2 = upload2.body.images[0].id;
    const imageId3 = upload3.body.images[0].id;

    await request(app.server)
      .delete(`/image/${imageId1}`)
      .set("Authorization", `Bearer ${token}`);

    await request(app.server)
      .delete(`/image/${imageId3}`)
      .set("Authorization", `Bearer ${token}`);

    const petResponse = await request(app.server).get(`/pet/${pet.id}`);

    const petImages = petResponse.body.pet.images || [];

    expect(petImages).toHaveLength(1);
    expect(petImages[0].id).toBe(imageId2);
  });
});
