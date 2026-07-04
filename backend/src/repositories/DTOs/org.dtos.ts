import type { Org } from "@/@types/org.js";

export interface CreateOrgInput {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  state: string;
  city: string;
}

export interface CreateOrgOutput {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  state: string;
  city: string;
}

export interface LoginOrgInput {
  email: string;
  password: string;
}

export interface LoginOrgOutput {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  state: string;
  city: string;
}
