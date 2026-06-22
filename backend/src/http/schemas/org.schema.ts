export const orgBodySchema = {
  type: "object",
  required: ["name", "email", "password", "whatsapp", "city", "state"],
  properties: {
    name: { type: "string", minLength: 3, example: "ONG Patinhas Felizes" },
    email: { type: "string", format: "email", example: "contato@patinhas.org" },
    password: { type: "string", minLength: 8, example: "senha@123" },
    whatsapp: { type: "string", example: "11987654321" },
    city: { type: "string", example: "São Paulo" },
    state: { type: "string", example: "SP" },
  },
} as const;

export const orgResponseSchema = {
  $id: "Org",
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    },
    name: { type: "string", example: "ONG Patinhas Felizes" },
    email: { type: "string", format: "email", example: "contato@patinhas.org" },
    whatsapp: { type: "string", example: "11987654321" },
    city: { type: "string", example: "São Paulo" },
    state: { type: "string", example: "SP" },
    created_at: {
      type: "string",
      format: "date-time",
      example: "2024-01-15T10:30:00.000Z",
    },
  },
} as const;
