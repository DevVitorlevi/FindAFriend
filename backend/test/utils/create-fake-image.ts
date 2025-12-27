export function createFakeImage(): Buffer {
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

  return Buffer.from(base64Image, 'base64')
}

export function createFakeImages(count: number): Buffer[] {
  return Array.from({ length: count }, () => createFakeImage())
}