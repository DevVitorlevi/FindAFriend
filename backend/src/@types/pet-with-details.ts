import type { Pet } from "./pet.js";
import type { Org } from "./org.js";
import type { PetImage } from "./pet-image.js";

export type PetWithDetails = Pet & {
  org: Org;
  images: PetImage[];
};
