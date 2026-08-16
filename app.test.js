const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");

const PORT = 3101;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let body = "";

      res.setEncoding("utf8");

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        resolve({
          status: res.statusCode,
          body
        });
      });
    });

    req.on("error", reject);
  });
}

let server;

test.before(() => {
  process.env.PORT = String(PORT);

  server = require("./app");

  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", resolve);
  });
});

test.after(() => {
  server.close();
});

test("health endpoint returns healthy status", async () => {
  const response = await request("/health");

  assert.equal(response.status, 200);

  const data = JSON.parse(response.body);

  assert.equal(data.status, "healthy");
});

test("readiness endpoint returns ready status", async () => {
  const response = await request("/ready");

  assert.equal(response.status, 200);

  const data = JSON.parse(response.body);

  assert.equal(data.status, "ready");
});

test("metrics endpoint returns request metrics", async () => {
  const response = await request("/metrics");

  assert.equal(response.status, 200);

  const data = JSON.parse(response.body);

  assert.equal(typeof data.requests, "number");
});

test("unknown route returns 404", async () => {
  const response = await request("/does-not-exist");

  assert.equal(response.status, 404);
});
