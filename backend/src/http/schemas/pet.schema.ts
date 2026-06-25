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
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    description: { type: "string" },
    age: { type: "string", enum: ["FILHOTE", "ADULTO", "IDOSO"] },
    size: { type: "string", enum: ["PEQUENO", "MEDIO", "GRANDE"] },
    adopted: { type: "boolean" },
    org_id: { type: "string", format: "uuid" },
    created_at: { type: "string", format: "date-time" },
    images: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          url: { type: "string" },
          pet_id: { type: "string", format: "uuid" },
          created_at: { type: "string", format: "date-time" },
        },
      },
    },
    org: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string" },
        email: { type: "string" },
        whatsapp: { type: "string" },
        state: { type: "string" },
        city: { type: "string" },
        created_at: { type: "string", format: "date-time" },
      },
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
