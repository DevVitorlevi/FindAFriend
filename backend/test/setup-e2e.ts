import { execSync } from "node:child_process";
import { config } from "dotenv";

config({ path: ".env.test", override: true });

function setupTestDatabase() {
  try {
    console.log("🔧 Configurando banco de dados de testes...");

    execSync("npx prisma migrate deploy", {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      stdio: "inherit",
    });

    console.log("✅ Banco de dados de testes configurado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao configurar banco de dados de testes:", error);
    throw error;
  }
}

setupTestDatabase();
