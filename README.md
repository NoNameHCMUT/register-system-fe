# Mua He Xanh Online Register System

A modern, responsive web application for managing online registrations built with **React**, **TypeScript**, and **Vite**.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Install pnpm](#install-pnpm)
  - [Install Project Dependencies](#install-project-dependencies)
- [Running the Project](#running-the-project)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Git Workflow (GitFlow)](#git-workflow-gitflow)
- [Pre-commit Hooks with Husky and Commitlint](#pre-commit-hooks-with-husky-and-commitlint)

## Overview

Mua He Xanh Online Register System is a feature-rich registration platform designed to streamline the registration process for participants. The frontend is built using modern web technologies to ensure fast performance, type safety, and an excellent user experience.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher) - [Download](https://nodejs.org/)
- **Git** (for version control) - [Download](https://git-scm.com/)

## Installation

### Install pnpm

pnpm is a fast, disk space-efficient package manager for JavaScript. Follow these steps to install it:

#### On macOS using Homebrew

```bash
brew install pnpm
```

#### On Linux or using NPM

```bash
npm install -g pnpm
```

#### Verify Installation

```bash
pnpm --version
```

For more installation options and details, visit [pnpm official documentation](https://pnpm.io/installation).

### Install Project Dependencies

1. Clone the repository (if you haven't already):

```bash
git clone <repository-url>
cd register-system-fe
```

1. Install dependencies using pnpm:

```bash
pnpm install
```

This command will install all the required dependencies specified in `package.json` and create a `pnpm-lock.yaml` file to ensure consistent installs across different environments.

## Running the Project

### Development Mode

To start the development server with hot module reloading (HMR):

```bash
pnpm dev
```

The application will start at `http://localhost:5173` (or another available port). The development server automatically reloads the page whenever you make changes to your code.

### Preview Production Build

To build and preview the production version locally:

```bash
pnpm build
pnpm preview
```

## Building for Production

To create an optimized production build:

```bash
pnpm build
```

The compiled files will be output to the `dist` directory. These files are ready to be deployed to a web server or hosting platform.

## Project Structure

```
register-system-fe/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── assets/           # Static assets (images, etc.)
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── public/               # Public static files
├── index.html            # HTML template
├── package.json          # Project dependencies and scripts
├── pnpm-lock.yaml        # Dependency lock file
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── eslint.config.js      # ESLint configuration
```

## Available Scripts

Defined in `package.json`:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint to check code quality

## Technologies Used

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Oxc** - Modern JavaScript tooling
- **ESLint** - Code quality and consistency

## Git Workflow (GitFlow)

This project follows a GitFlow branching strategy to maintain code quality and organization:

### Branch Structure

- **main** - The primary production-ready branch. Direct commits to this branch are not allowed.
- **feat/*** - Feature branches for new features (e.g., `feat/user-registration`, `feat/dashboard`)
- **fix/*** - Bug fix branches for fixing issues (e.g., `fix/login-validation`, `fix/responsive-layout`)

### Workflow Steps

1. **Create a feature or fix branch from main:**

   ```bash
   # For new features
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature-name
   
   # For bug fixes
   git checkout main
   git pull origin main
   git checkout -b fix/your-fix-name
   ```

2. **Make your changes** on the feature/fix branch

3. **Commit your changes:**

   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

4. **Keep your branch updated:**

   ```bash
   git fetch -a
   git pull origin
   ```

5. **Push your branch:**

   ```bash
   git push origin feat/your-feature-name
   # or
   git push origin fix/your-fix-name
   ```

6. **Create a Pull Request** for code review before merging to main

### Important Rules

- **DO NOT** work directly on the `main` branch
- **DO NOT** commit directly to `main`
- **DO** create separate branches for each feature or fix
- **DO** use descriptive branch names
- **DO** submit pull requests for review before merging

## Pre-commit Hooks with Husky and Commitlint

This project uses [Husky](https://typicode.github.io/husky/) and [Commitlint](https://commitlint.js.org/) to enforce code quality and commit message conventions before code is committed.

### Install Dependencies

```bash
pnpm i husky lint-staged
pnpm i @commitlint/cli @commitlint/config-conventional
```

### Initialize Husky

```bash
pnpm husky init
```

### Commitlint Configuration

Create a `commitlint.config.js` file in the project root:

```js
export default {
   extends: ['@commitlint/config-conventional'],
};
```

This configuration enforces conventional commit messages such as:

```bash
feat: add registration form
fix: handle validation error
chore: update dependencies
```

### Pre-commit Hook

The `.husky/pre-commit` file runs the following checks before a commit is created:

```bash
pnpm husky init

cat << 'EOF' > .husky/pre-commit
echo "Running TypeScript type checking..."
pnpm tsc --noEmit

echo "Pre-commit checks completed!"
EOF

echo "pnpm commitlint --edit $1" >> .husky/commit-msg
```

### Make Hook Files Executable

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

## License

This project is proprietary software for Mua He Xanh.

## Support

For issues, questions, or suggestions, please contact the development team.
