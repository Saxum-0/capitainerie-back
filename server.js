// server.js
const app = require("./app");
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(` ONLINE ✅  ${port}`);
});

// server.js
const http = require('http');
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  

  // Lancer les tests automatiquement
  if (process.env.NODE_ENV !== 'production') {
    const { exec } = require('child_process');
    console.log('📦 Lancement des tests...');
    exec('npx mocha tests/**/*.test.js', (err, stdout, stderr) => {
      if (err) {
        console.error('❌ Erreur pendant les tests :', stderr);
      } else {
        console.log('✅ Résultat des tests :\n', stdout);
      }
    });
  }
});
