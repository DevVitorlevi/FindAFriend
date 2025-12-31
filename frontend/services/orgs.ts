import { petAPI } from "./api"

export interface OrgRegisterRequest {
  name: string
  email: string
  password: string
  cep: string
  city: string
  state: string
  whatsapp: string
}


export async function registerOrg(data: OrgRegisterRequest) {
  const response = await petAPI.post("/orgs", data)

  return response.data
}
