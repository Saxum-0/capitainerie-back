const app = require("./app");
const http = require("http");
const { exec } = require("child_process");

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);

  // Automatically run tests when not in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Running tests...");

    const child = exec("npm run test");

    // Output from tests
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    // Error during tests
    child.stderr.on("data", (data) => {
      console.error("Test error:", data.toString());
    });

    // Test process end
    child.on("close", (code) => {
      console.log(`Tests finished with code: ${code}`);
    });
  }
});


