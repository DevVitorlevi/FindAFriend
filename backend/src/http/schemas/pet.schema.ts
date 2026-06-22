export const petBodySchema = {
  type: "object",
  required: ["name", "description", "age", "size"],
  properties: {
    name: { type: "string", example: "Rex" },
    description: {
      type: "string",
      maxLength: 300,
      example: "Cachorro brincalhão e carinhoso, adora crianças.",
    },
    age: {
      type: "string",
      enum: ["FILHOTE", "ADULTO", "IDOSO"],
      example: "FILHOTE",
    },
    size: {
      type: "string",
      enum: ["PEQUENO", "MEDIO", "GRANDE"],
      example: "MEDIO",
    },
  },
} as const;

export const petResponseSchema = {
  $id: "Pet",
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      example: "f1e2d3c4-b5a6-7890-abcd-123456789abc",
    },
    name: { type: "string", example: "Rex" },
    description: {
      type: "string",
      example: "Cachorro brincalhão e carinhoso, adora crianças.",
    },
    age: {
      type: "string",
      enum: ["FILHOTE", "ADULTO", "IDOSO"],
      example: "FILHOTE",
    },
    size: {
      type: "string",
      enum: ["PEQUENO", "MEDIO", "GRANDE"],
      example: "MEDIO",
    },
    adopted: { type: "boolean", example: false },
    org_id: {
      type: "string",
      format: "uuid",
      example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    },
    created_at: {
      type: "string",
      format: "date-time",
      example: "2024-01-15T10:30:00.000Z",
    },
  },
} as const;

export const petImageSchema = {
  $id: "PetImage",
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    url: { type: "string", format: "uri" },
    pet_id: { type: "string", format: "uuid" },
    created_at: { type: "string", format: "date-time" },
  },
} as const;
