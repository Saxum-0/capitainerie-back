const app = require("./app");
const http = require("http");
const { exec } = require("child_process");

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);

  if (process.env.NODE_ENV !== "production") {
    console.log("Lancement des tests...");

    const child = exec("npm run test");

    // tests
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    // erreur
    child.stderr.on("data", (data) => {
      console.error("Erreur test :", data.toString());
    });

    // end test
    child.on("close", (code) => {
      console.log(`Fin des tests avec code : ${code}`);
    });
  }
});


