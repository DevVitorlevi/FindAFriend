import { app } from "./app.js";

app
  .listen({
    host: "0.0.0.0",
    port: 3333,
  })
  .then(() => {
    console.log("Rodando Servidor");
    console.log("Docs em http://localhost:3333/docs");
  });
