import type { Age, Size } from "@generated/prisma/enums.js";

export interface UpdatePetInput {
  name?: string;
  description?: string;
  age?: Age;
  size?: Size;
}
export interface UpdatePetOutput {
  pet: {
    id: string;
    name: string;
    description: string;
    age: Age;
    size: Size;
    org_id: string;
  };
}
