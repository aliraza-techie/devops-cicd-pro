# DevOps CI/CD Pro

A production-style Node.js DevOps portfolio project demonstrating automated testing, Docker containerization, health checks, readiness checks, runtime metrics, and GitHub Actions CI/CD.

##  Features

- Git & GitHub
- CI/CD with GitHub Actions
- Automated Node.js testing
- Docker containerization
- Docker Compose
- GitHub Container Registry (GHCR)
- Docker HEALTHCHECK
- Application health endpoint
- Readiness endpoint
- Runtime metrics
- System information endpoint
- Graceful shutdown
- Non-root Docker container
- Environment variables
- Reproducible deployment workflow

## 🏗️ Architecture

```text
Developer
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    +----> Install Dependencies
    |
    +----> Run Automated Tests
    |
    v
Docker Build
    |
    v
GitHub Container Registry
    |
    v
Deployable Container Image
