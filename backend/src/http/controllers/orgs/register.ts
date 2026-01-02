import { orgPresenter } from "@/presenters/org-presenter.js";
import { makeCreateOrgUseCase } from "@/use-cases/factories/make-create-org-use-case.js";
import { OrgAlreadyExits } from "@/utils/errors/org-already-exist.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(3, {
      message:
        "O nome da organização deve ter ao menos 3 letras",
    }),

    email: z.email({
      message: "Email inválido",
    }),

    password: z.string().min(8, {
      message:
        "A senha deve ter ao menos 8 caracteres",
    }),

    whatsapp: z
      .string()
      .transform((value) =>
        value.replace(/\D/g, "")
      )
      .refine(
        (value) =>
          /^\d{2}9\d{8}$/.test(value),
        {
          message:
            "Número de WhatsApp inválido",
        }
      ),

    city: z.string(),
    state: z.string(),

  });

  const { name, email, password, whatsapp, city, state } = registerBodySchema.parse(request.body)
  try {
    const createOrgUseCase = makeCreateOrgUseCase()
    const { org } = await createOrgUseCase.execute({
      name,
      email,
      password,
      whatsapp,
      city,
      state,
    })
    return reply.status(201).send({
      message: "Organization created!!",
      org:orgPresenter(org)
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