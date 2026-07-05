export interface CreatePetImageInput {
  id?: string;
  url: string;
  petId: string;
}

export interface CreatePetImageOutput {
  id: string;
  url: string;
  petId: string;
  create_at: Date;
}
