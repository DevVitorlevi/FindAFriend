import type { FastifyInstance } from 'fastify'
import request from 'supertest'

interface CreatePetOptions {
  orgId: string
  token: string
  name?: string
  description?: string
  age?: 'FILHOTE' | 'ADULTO' | 'IDOSO'
  size?: 'PEQUENO' | 'MEDIO' | 'GRANDE'
}

export async function createPet(
  app: FastifyInstance,
  options: CreatePetOptions
) {
  const petData = {
    name: options.name ?? 'Pet Teste',
    description: options.description ?? 'Descrição do pet',
    age: options.age ?? 'ADULTO',
    size: options.size ?? 'MEDIO',
  }

  const response = await request(app.server)
    .post(`/pets/${options.orgId}/create`)
    .set('Authorization', `Bearer ${options.token}`)
    .send(petData)

  if (response.status !== 201) {
    console.error('Failed to create pet:', response.body)
    throw new Error(`Failed to create pet: ${response.status}`)
  }

  if (!response.body.pet || !response.body.pet.id) {
    console.error('Pet or pet.id not found in response:', response.body)
    throw new Error('Pet not returned from API')
  }

  return {
    pet: response.body.pet,
  }
}