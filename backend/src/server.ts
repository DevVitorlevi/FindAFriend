import { app } from "./app.js";
import { env } from "@/env/index.js";

const port = env.PORT ? Number(env.PORT) : 3333;

app
  .listen({
    host: "0.0.0.0",
    port,
  })
  .then(() => {
    console.log(`Rodando Servidor na porta ${port}`);
    console.log("Docs em /docs");
  });
