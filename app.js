const http = require("http");
const os = require("os");

const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const startedAt = Date.now();

const metrics = {
  requests: 0,
  healthChecks: 0,
  readinessChecks: 0,
  errors: 0
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });

  res.end(JSON.stringify(payload));
}

function sendHtml(res, html) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  });

  res.end(html);
}

const server = http.createServer((req, res) => {
  metrics.requests += 1;

  try {
    const url = new URL(
      req.url,
      `http://${req.headers.host || "localhost"}`
    );

    if (url.pathname === "/health") {
      metrics.healthChecks += 1;

      return sendJson(res, 200, {
        status: "healthy",
        service: "devops-cicd-pro",
        version: "2.0.0",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === "/ready") {
      metrics.readinessChecks += 1;

      return sendJson(res, 200, {
        status: "ready",
        checks: {
          application: "ok",
          runtime: "ok"
        },
        timestamp: new Date().toISOString()
      });
    }

    if (url.pathname === "/metrics") {
      return sendJson(res, 200, {
        service: "devops-cicd-pro",
        environment: NODE_ENV,
        hostname: os.hostname(),
        uptimeSeconds: Math.floor(process.uptime()),
        memory: process.memoryUsage(),
        requests: metrics.requests,
        healthChecks: metrics.healthChecks,
        readinessChecks: metrics.readinessChecks,
        errors: metrics.errors,
        startedAt: new Date(startedAt).toISOString()
      });
    }

    if (url.pathname === "/api/info") {
      return sendJson(res, 200, {
        name: "DevOps CI/CD Pro",
        version: "2.0.0",
        environment: NODE_ENV,
        runtime: process.version,
        platform: process.platform,
        architecture: process.arch
      });
    }

    if (url.pathname === "/") {
      return sendHtml(
        res,
        `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DevOps CI/CD Pro</title>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #07111f;
  color: #eef6ff;
}

main {
  max-width: 1000px;
  margin: 60px auto;
  padding: 24px;
}

.hero {
  padding: 34px;
  border: 1px solid #21334a;
  border-radius: 20px;
  background: #0d1b2d;
}

h1 {
  font-size: 42px;
  margin: 0 0 12px;
}

p {
  color: #b8c9dc;
  line-height: 1.7;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.card {
  padding: 20px;
  border: 1px solid #21334a;
  border-radius: 16px;
  background: #0a1626;
}

.badge {
  display: inline-block;
  padding: 7px 11px;
  border-radius: 999px;
  background: #123c2a;
  color: #7ff0ad;
}

a {
  color: #72b8ff;
  text-decoration: none;
}
</style>
</head>

<body>

<main>

<section class="hero">

<span class="badge">● Service Online</span>

<h1> DevOps CI/CD Pro</h1>

<p>
Production-style Node.js service with automated testing,
Docker, health checks, readiness, metrics and GitHub Actions CI/CD.
</p>

</section>

<section class="grid">

<div class="card">
<h2>Health</h2>
<p>
<a href="/health">/health</a> — application health status.
</p>
</div>

<div class="card">
<h2>Readiness</h2>
<p>
<a href="/ready">/ready</a> — readiness status.
</p>
</div>

<div class="card">
<h2>Metrics</h2>
<p>
<a href="/metrics">/metrics</a> — runtime metrics.
</p>
</div>

<div class="card">
<h2>System Info</h2>
<p>
<a href="/api/info">/api/info</a> — runtime information.
</p>
</div>

</section>

</main>

</body>
</html>`
      );
    }

    metrics.errors += 1;

    return sendJson(res, 404, {
      error: "Not Found",
      path: url.pathname
    });

  } catch (error) {

    metrics.errors += 1;

    return sendJson(res, 500, {
      error: "Internal Server Error"
    });
  }
});

function shutdown(signal) {

  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(() => {

    console.log("HTTP server closed.");

    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

if (require.main === module) {

  server.listen(PORT, "0.0.0.0", () => {

    console.log(
      `DevOps CI/CD Pro running on port ${PORT}`
    );

  });
}

module.exports = server;
