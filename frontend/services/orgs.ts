import { petAPI } from "./api"

export interface OrgRegisterRequest {
  name: string
  email: string
  state: string
  city: string
  whatsapp: string
  password: string
}

export interface OrgLoginRequest {
  email: string
  password: string
}

export interface Org {
  id: string
  name: string
  email: string
  state: string
  city: string
  whatsapp: string
}

export interface LoginResponse {
  org: Org
}

export interface MeResponse {
  org: Org
}

export async function registerOrg(data: OrgRegisterRequest) {
  const response = await petAPI.post("/orgs", data)
  return response.data
}

export async function loginOrg(
  data: OrgLoginRequest
): Promise<LoginResponse> {
  const response = await petAPI.post("/sessions", data)
  return response.data
}

export async function getMe(): Promise<MeResponse> {
  const response = await petAPI.get("/me")
  return response.data
}
