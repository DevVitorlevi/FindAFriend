import type { Org } from "generated/prisma/browser.js";

export function orgPresenter(org: Org) {
  return {
    id: org.id,
    name: org.name,
    email: org.email,
    state: org.state,
    city: org.city,
    whatsapp: org.whatsapp,
  };
}