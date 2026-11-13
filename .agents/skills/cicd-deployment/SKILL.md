---
name: cicd-deployment
description: Automate continuous integration, test execution, security scans, automated database migrations, zero-downtime deployment, and rollback procedures for Flatmate.
---

# CI/CD and Deployment Skill

## Purpose
Build, maintain, and verify continuous integration and deployment automation pipelines for Flatmate, ensuring automated quality gates and zero-downtime rollbacks.

## When to Use It
- During Workflow F (Infrastructure & Deployment) and Workflow G (Release).
- When configuring GitHub Actions pipelines, build scripts, or deployment webhooks.
- When executing release sign-offs and testing rollback procedures.

## Required Inputs
- Docker build configurations and test automation commands.
- Deployment environment specifications (Staging, Production).
- Authority Level 3 requirements for production approvals.

## Step-by-Step Procedure
1. **Design Multi-Stage CI Pipeline (`.github/workflows/ci.yml`)**:
   - Stage 1 (Lint & Format): ESLint, Prettier, TypeScript compiler check (`tsc --noEmit`).
   - Stage 2 (Automated Tests): Run Vitest/Jest unit & integration tests; fail on coverage < 80%.
   - Stage 3 (Security Scan): Run `npm audit` and static security linters.
   - Stage 4 (Container Build): Build Docker images; test container startup healthcheck.
2. **Design Continuous Delivery Pipeline (`.github/workflows/cd.yml`)**:
   - Automated deployment to Staging on push to `main`.
   - Production deployment gated behind manual GitHub Environment Approval (enforcing Authority Level 3).
3. **Automate Pre-Deployment Database Migrations**:
   - Run migrations as a one-off ephemeral task before routing traffic to new application containers.
   - Abort deployment immediately if migration fails.
4. **Define Zero-Downtime Rollback Runbook**:
   - Revert traffic to prior container revision instantly upon health probe failure.
   - Execute database down-migration only if data compatibility is preserved.
5. **Publish Deployment & Rollback Documentation**: Save in `docs/deployment/cicd-pipeline.md` and `docs/deployment/rollback-runbook.md`.

## Expected Outputs
- CI/CD workflow definitions.
- `docs/deployment/cicd-pipeline.md`
- `docs/deployment/rollback-runbook.md`

## Quality Checklist
- [ ] Production deployments strictly require manual approval (Level 3 governance).
- [ ] Failed tests or security alerts immediately block deployment.
- [ ] Documented rollback procedure verified with a dry-run test.

## Relevant References
- [cloud-infrastructure](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/cloud-infrastructure/SKILL.md)
- [security-engineering](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/security-engineering/SKILL.md)
- [test-automation](file:///home/akhil/Vibe%20Coding/Flatmate/.agents/skills/test-automation/SKILL.md)

