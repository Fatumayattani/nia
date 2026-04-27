# GitHub Actions Workflows

## CI/CD Pipeline

This directory contains GitHub Actions workflows for automated testing and deployment.

### Workflows

- `test.yml` - Run tests on pull requests
- `deploy.yml` - Deploy to production

## Setting Up

1. Add secrets to GitHub repository:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`

2. Workflows will trigger automatically on:
   - Push to main branch
   - Pull requests

## Logs

View workflow logs in the Actions tab of the GitHub repository.
