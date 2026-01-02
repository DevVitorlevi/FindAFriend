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
  email: string,
  password: string
}


export async function registerOrg(data: OrgRegisterRequest) {
  const response = await petAPI.post("/orgs", data)
  return response.data
}

export async function loginOrg(data: OrgLoginRequest) {
  const response = await petAPI.post("/sessions", data)
  return response.data
}
