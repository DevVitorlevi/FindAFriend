import { makeCreateOrgUseCase } from "@/use-cases/factories/make-create-org-use-case.js";
import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8), cep: z
      .string()
      .regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    whatsapp: z
      .string()
      .transform(value => value.replace(/\D/g, ''))
      .refine(value => {
        return /^\d{2}9\d{8}$/.test(value)
      }, {
        message: 'Número de WhatsApp inválido',
      }),
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    }),
    city: z.string(),
    state: z.string(),
    street: z.string(),
    numberHome: z.number()
  })

  const { name, email, password, cep, whatsapp, latitude, longitude, city, state, street, numberHome } = registerBodySchema.parse(request.body)

  try {
    const createOrgUseCase = makeCreateOrgUseCase()
    const { org } = await createOrgUseCase.execute({
      name,
      email,
      password,
      cep,
      whatsapp,
      latitude,
      longitude,
      city,
      state,
      street,
      numberHome
    })
    return reply.status(201).send({
      message: "Organization created!!",
      org
    })

  } catch (error) {
    if (error instanceof OrgAlreadyExits) {
      return reply.status(409).send({
        message: error.message
      })
    }

    throw error
  }

}