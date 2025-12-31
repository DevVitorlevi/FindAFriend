import { petAPI } from "./api"

export interface OrgRegisterRequest {
  name: string
  email: string
  state: string
  city: string
  whatsapp: string
  password: string
}


export async function registerOrg(data: OrgRegisterRequest) {
  const response = await petAPI.post("/orgs", data)

  return response.data
}
