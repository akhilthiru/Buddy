---
name: cloud-infrastructure
description: Define cloud infrastructure, Docker containerization, local development environments, Infrastructure as Code, and observability for Flatmate.
---

# Cloud Infrastructure Skill

## Purpose
Architect, containerize, and provision reproducible cloud environments and local development stacks for Flatmate, ensuring security, resilience, and operational cost-efficiency.

## When to Use It
- During Workflow C (Architecture & Design) and Workflow F (Infrastructure & Deployment).
- When setting up local development tools (`docker-compose.yml`) or cloud topologies.
- When configuring database hosting, object storage, and DNS/SSL.

## Required Inputs
- Non-functional requirements (availability, concurrency, latency targets).
- Tech stack specification: Next.js frontend, Node.js backend, PostgreSQL database, Redis.

## Step-by-Step Procedure
1. **Author Hardened Container Images**:
   - Next.js multi-stage Dockerfile (build stage, pruned standalone production runner with unprivileged user).
   - Node.js backend multi-stage Dockerfile (TypeScript compiler stage, slim production runtime).
   - `.dockerignore` omitting `.git`, `node_modules`, test artifacts, and `.env`.
2. **Configure Local Developer Stack (`docker-compose.yml`)**:
   - Services: `frontend`, `backend`, `postgres` (with healthcheck and volume persistence), `redis` (for caching/rate-limiting).
3. **Specify Cloud Infrastructure Architecture**:
   - Container hosting (e.g., Managed Cloud Run, ECS, or Kubernetes/VPS container instances).
   - Managed PostgreSQL with automated daily snapshots and point-in-time recovery (PITR).
   - S3-compatible object storage for user-uploaded avatars and room photos with pre-signed upload URLs.
   - Cloudflare CDN / WAF for DDoS protection, TLS termination, and asset caching.
4. **Configure Monitoring & Observability**:
   - Structured JSON logging, Prometheus metrics endpoints, and health probes (`/healthz`, `/readyz`).
5. **Publish Infrastructure Specs**: Save in `docs/deployment/cloud-infrastructure.md`.

## Expected Outputs
- Hardened Dockerfiles and `docker-compose.yml`.
- `docs/deployment/cloud-infrastructure.md`
- Environment variable dictionary in `docs/deployment/environment-variables.md`.

## Quality Checklist
- [ ] Docker images run as non-root unprivileged users.
- [ ] Database storage has automated backup and persistence configured.
- [ ] Environment secrets are cleanly separated from image builds.

## Relevant References
- [cicd-deployment](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/cicd-deployment/SKILL.md)
- [security-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/security-engineering/SKILL.md)
