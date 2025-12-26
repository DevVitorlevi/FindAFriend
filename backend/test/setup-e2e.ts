import { execSync } from 'node:child_process'
import { config } from 'dotenv'

// Carregar variáveis de ambiente de teste
config({ path: '.env.test', override: true })

// Função para garantir que o banco de dados de teste existe e está atualizado
function setupTestDatabase() {
  try {
    console.log('🔧 Configurando banco de dados de testes...')

    // Aplica as migrations no banco de testes
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      stdio: 'inherit'
    })

    console.log('✅ Banco de dados de testes configurado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados de testes:', error)
    throw error
  }
}

// Executar antes de todos os testes
setupTestDatabase()