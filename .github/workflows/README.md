# GitHub Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### `ci.yml` - Continuous Integration

This workflow runs on all pull requests and pushes to main/feature branches and ensures code quality:

1. Sets up Node.js v22
2. Installs dependencies
3. Runs all tests
4. Performs linting
5. Verifies both Easter and Christmas builds

This helps catch issues before they're merged into the main branch.

### `deploy.yml` - Deployment to GitHub Pages

This workflow automatically deploys to GitHub Pages whenever changes are pushed to the main branch:

1. Sets up Node.js v22
2. Installs dependencies
3. Runs all tests to ensure code quality
4. Builds the React application
5. Sets up GitHub Pages
6. Uploads the build artifacts
7. Deploys the built files to GitHub Pages
8. Makes the application available at https://outofcoffee.github.io/holiday-tracker/

## Badges

You can add these badges to your README.md to show the status of your workflows:

```markdown
[![CI](https://github.com/outofcoffee/holiday-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/outofcoffee/holiday-tracker/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/outofcoffee/holiday-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/outofcoffee/holiday-tracker/actions/workflows/deploy.yml)
```