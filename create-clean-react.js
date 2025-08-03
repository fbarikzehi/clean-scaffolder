#!/usr/bin/env node
// create-clean-react.js - Enhanced Clean React Scaffolding Script

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Color codes for better console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

function colorLog(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function ensureInquirer() {
    try {
        const { default: inquirer } = await import('inquirer');
        return inquirer;
    } catch {
        colorLog('cyan', '📦 "inquirer" not found. Installing...');
        try {
            execSync('npm install inquirer@latest', { stdio: 'pipe' });
            const { default: inquirer } = await import('inquirer');
            colorLog('green', '✅ Inquirer installed successfully');
            return inquirer;
        } catch (err) {
            colorLog('red', '❌ Failed to install "inquirer"');
            console.error(err.message);
            process.exit(1);
        }
    }
}

function validateProjectName(name) {
    if (!name) return 'Project name cannot be empty.';
    if (name.length < 2) return 'Project name must be at least 2 characters long.';
    if (name.length > 50) return 'Project name must be less than 50 characters.';

    const forbiddenChars = /[<>:"\/\\|?*\x00-\x1F]/g;
    if (forbiddenChars.test(name)) return 'Project name contains invalid characters.';

    const reservedNames = ['con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'lpt1', 'lpt2'];
    if (reservedNames.includes(name.toLowerCase())) return 'Project name is reserved.';

    if (fs.existsSync(path.resolve(process.cwd(), name))) {
        return `Directory "${name}" already exists.`;
    }
    return true;
}

function safeDelete(filePath, description = '') {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true });
            } else {
                fs.unlinkSync(filePath);
            }
            colorLog('yellow', `🧹 Removed: ${description || filePath}`);
        }
    } catch (err) {
        colorLog('red', `⚠️  Failed to remove ${filePath}: ${err.message}`);
    }
}

function safeExec(command, options = {}) {
    try {
        colorLog('blue', `▶️  ${command}`);
        return execSync(command, { stdio: 'pipe', ...options });
    } catch (err) {
        throw new Error(`Command failed: ${command}\n${err.message}`);
    }
}

function createFileWithContent(filePath, content, description = '') {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, content);
        colorLog('green', `📝 Created: ${description || path.basename(filePath)}`);
    } catch (err) {
        throw new Error(`Failed to create ${filePath}: ${err.message}`);
    }
}

function getTemplateConfigs() {
    return {
        tailwind: `import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;`,

        indexCSS: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`,

        prettier: `{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}`,

        eslint: `{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "react-hooks", "@typescript-eslint"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}`,

        gitignore: `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
Thumbs.db

# Build tools
*.tsbuildinfo

# Temporary folders
tmp/
temp/`,

        vscodeSettings: `{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}`,

        vscodeExtensions: `{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}`,

        readmeTemplate: (projectName, packageManager, features) => `# ${projectName}

A modern React application built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

${features.map(f => `- ✅ ${f}`).join('\n')}

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Package Manager**: ${packageManager}
- **Code Quality**: ESLint + Prettier
- **Version Control**: Git

## 📦 Installation

\`\`\`bash
# Install dependencies
${packageManager} install

# Start development server
${packageManager} run dev

# Build for production
${packageManager} run build

# Preview production build
${packageManager} run preview
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── app/              # App configuration and providers
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components
│   └── shared/      # Shared business components
├── features/        # Feature-based modules
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and configurations
├── stores/          # State management
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
└── assets/          # Static assets
\`\`\`

## 🎯 Development Guidelines

- Follow the established folder structure
- Use TypeScript for type safety
- Write clean, readable code
- Follow the configured ESLint and Prettier rules
- Create reusable components in the \`components\` directory
- Organize features in the \`features\` directory

## 📝 Scripts

- \`dev\` - Start development server
- \`build\` - Build for production
- \`preview\` - Preview production build
- \`lint\` - Run ESLint
- \`lint:fix\` - Fix ESLint issues
- \`format\` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

Built with ❤️ using modern web technologies.`
    };
}

async function main() {
    try {
        colorLog('magenta', '🚀 Welcome to Enhanced React Project Scaffolder');
        colorLog('cyan', '─'.repeat(50));

        const inquirer = await ensureInquirer();

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: '📦 What is your project name?',
                validate: validateProjectName,
            },
            {
                type: 'list',
                name: 'packageManager',
                message: '📋 Choose your package manager:',
                choices: [
                    { name: 'npm (Node Package Manager)', value: 'npm' },
                    { name: 'yarn (Yarn Package Manager)', value: 'yarn' },
                    { name: 'pnpm (Performant NPM)', value: 'pnpm' },
                ],
                default: 'npm',
            },
            {
                type: 'list',
                name: 'template',
                message: '🎨 Choose your React template:',
                choices: [
                    { name: 'TypeScript (Recommended)', value: 'react-ts' },
                    { name: 'JavaScript', value: 'react' },
                    { name: 'TypeScript + SWC', value: 'react-swc-ts' },
                    { name: 'JavaScript + SWC', value: 'react-swc' },
                ],
                default: 'react-ts',
            },
            {
                type: 'checkbox',
                name: 'features',
                message: '⚡ Select features to include:',
                choices: [
                    { name: 'Tailwind CSS (Styling)', value: 'tailwind', checked: true },
                    { name: 'React Router (Routing)', value: 'router', checked: true },
                    { name: 'Zustand (State Management)', value: 'zustand', checked: false },
                    { name: 'React Query (Data Fetching)', value: 'query', checked: false },
                    { name: 'React Hook Form (Forms)', value: 'forms', checked: false },
                    { name: 'Framer Motion (Animations)', value: 'motion', checked: false },
                    { name: 'i18next (Internationalization)', value: 'i18n', checked: false },
                    { name: 'Axios (HTTP Client)', value: 'axios', checked: false },
                    { name: 'Lucide React (Icons)', value: 'icons', checked: true },
                ],
            },
            {
                type: 'checkbox',
                name: 'devTools',
                message: '🛠️  Select development tools:',
                choices: [
                    { name: 'ESLint + Prettier (Code Quality)', value: 'linting', checked: true },
                    { name: 'Husky + lint-staged (Git Hooks)', value: 'husky', checked: false },
                    { name: 'Jest + Testing Library (Testing)', value: 'testing', checked: false },
                    { name: 'Storybook (Component Documentation)', value: 'storybook', checked: false },
                    { name: 'VS Code Settings', value: 'vscode', checked: true },
                ],
            },
            {
                type: 'confirm',
                name: 'useGit',
                message: '🌱 Initialize Git repository?',
                default: true,
            },
            {
                type: 'confirm',
                name: 'cleanInstall',
                message: '🧹 Clean up after installation (remove node_modules for micro-frontend)?',
                default: false,
            },
        ]);

        const { projectName, packageManager, template, features, devTools, useGit, cleanInstall } = answers;
        const projectPath = path.resolve(process.cwd(), projectName);

        colorLog('green', `\n🚀 Creating ${template} project: "${projectName}"`);
        colorLog('blue', `📍 Location: ${projectPath}`);
        colorLog('cyan', '─'.repeat(50));

        // Step 1: Create Vite project
        colorLog('yellow', '\n📦 Creating Vite project...');
        safeExec(`npm create vite@latest ${projectName} -- --template ${template}`);
        process.chdir(projectPath);

        // Step 2: Install base dependencies
        colorLog('yellow', '\n📦 Installing base dependencies...');
        safeExec(`${packageManager} install`);

        // Step 3: Install feature dependencies
        const dependencies = [];
        const devDependencies = [];

        if (features.includes('tailwind')) {
            dependencies.push('tailwindcss', 'postcss', 'autoprefixer', 'clsx', 'tailwind-merge');
        }
        if (features.includes('router')) dependencies.push('react-router-dom');
        if (features.includes('zustand')) dependencies.push('zustand');
        if (features.includes('query')) dependencies.push('@tanstack/react-query');
        if (features.includes('forms')) dependencies.push('react-hook-form', '@hookform/resolvers', 'zod');
        if (features.includes('motion')) dependencies.push('framer-motion');
        if (features.includes('i18n')) dependencies.push('i18next', 'react-i18next');
        if (features.includes('axios')) dependencies.push('axios');
        if (features.includes('icons')) dependencies.push('lucide-react');

        if (devTools.includes('linting')) {
            devDependencies.push(
                'eslint',
                'prettier',
                'eslint-config-prettier',
                'eslint-plugin-react',
                'eslint-plugin-react-hooks',
                '@typescript-eslint/eslint-plugin',
                '@typescript-eslint/parser'
            );
        }
        if (devTools.includes('husky')) {
            devDependencies.push('husky', 'lint-staged');
        }
        if (devTools.includes('testing')) {
            devDependencies.push('jest', '@testing-library/react', '@testing-library/jest-dom', '@testing-library/user-event');
        }

        if (dependencies.length > 0) {
            colorLog('yellow', `\n📦 Installing feature dependencies: ${dependencies.join(', ')}`);
            safeExec(`${packageManager} add ${dependencies.join(' ')}`);
        }

        if (devDependencies.length > 0) {
            colorLog('yellow', `\n📦 Installing dev dependencies: ${devDependencies.join(', ')}`);
            safeExec(`${packageManager} add -D ${devDependencies.join(' ')}`);
        }

        // Step 4: Create folder structure
        colorLog('yellow', '\n📁 Creating project structure...');
        const folders = [
            'src/app',
            'src/components/ui',
            'src/components/shared',
            'src/features',
            'src/hooks',
            'src/lib',
            'src/stores',
            'src/types',
            'src/utils',
            'src/assets',
            'public',
        ];

        if (features.includes('i18n')) {
            folders.push('src/i18n/locales/en', 'src/i18n/locales/es');
        }

        folders.forEach(folder => {
            const folderPath = path.join(projectPath, folder);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                colorLog('green', `📁 Created: ${folder}`);
            }
        });

        // Step 5: Configure files
        const templates = getTemplateConfigs();

        if (features.includes('tailwind')) {
            colorLog('yellow', '\n🎨 Configuring Tailwind CSS...');
            safeExec('npx tailwindcss init -p');
            createFileWithContent(
                path.join(projectPath, 'tailwind.config.ts'),
                templates.tailwind,
                'Tailwind config'
            );
            createFileWithContent(
                path.join(projectPath, 'src/index.css'),
                templates.indexCSS,
                'Tailwind CSS'
            );
        }

        if (devTools.includes('linting')) {
            colorLog('yellow', '\n🧹 Setting up code quality tools...');
            createFileWithContent(
                path.join(projectPath, '.prettierrc'),
                templates.prettier,
                'Prettier config'
            );
            createFileWithContent(
                path.join(projectPath, '.eslintrc.json'),
                templates.eslint,
                'ESLint config'
            );
        }

        if (devTools.includes('vscode')) {
            colorLog('yellow', '\n⚙️  Setting up VS Code configuration...');
            createFileWithContent(
                path.join(projectPath, '.vscode/settings.json'),
                templates.vscodeSettings,
                'VS Code settings'
            );
            createFileWithContent(
                path.join(projectPath, '.vscode/extensions.json'),
                templates.vscodeExtensions,
                'VS Code extensions'
            );
        }

        // Step 6: Git setup
        if (useGit) {
            colorLog('yellow', '\n🌱 Initializing Git repository...');
            safeExec('git init');
            createFileWithContent(
                path.join(projectPath, '.gitignore'),
                templates.gitignore,
                'Git ignore'
            );
        }

        // Step 7: Create README
        const featureList = [
            'Modern React with TypeScript',
            'Vite for fast development',
            ...features.map(f => {
                const featureNames = {
                    tailwind: 'Tailwind CSS for styling',
                    router: 'React Router for navigation',
                    zustand: 'Zustand for state management',
                    query: 'React Query for data fetching',
                    forms: 'React Hook Form for forms',
                    motion: 'Framer Motion for animations',
                    i18n: 'i18next for internationalization',
                    axios: 'Axios for HTTP requests',
                    icons: 'Lucide React for icons',
                };
                return featureNames[f] || f;
            }),
            ...devTools.map(t => {
                const toolNames = {
                    linting: 'ESLint + Prettier for code quality',
                    husky: 'Husky for git hooks',
                    testing: 'Jest + Testing Library',
                    storybook: 'Storybook for component docs',
                    vscode: 'VS Code configuration',
                };
                return toolNames[t] || t;
            }),
        ];

        createFileWithContent(
            path.join(projectPath, 'README.md'),
            templates.readmeTemplate(projectName, packageManager, featureList),
            'README.md'
        );

        // Step 8: Update package.json scripts
        try {
            const packageJsonPath = path.join(projectPath, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

            packageJson.scripts = {
                ...packageJson.scripts,
                'lint': 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
                'lint:fix': 'eslint src --ext ts,tsx --fix',
                'format': 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"',
                'type-check': 'tsc --noEmit',
            };

            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            colorLog('green', '📝 Updated package.json scripts');
        } catch (err) {
            colorLog('yellow', `⚠️  Could not update package.json: ${err.message}`);
        }

        // Step 9: Clean installation (if requested)
        if (cleanInstall) {
            colorLog('yellow', '\n🧹 Cleaning up for micro-frontend architecture...');
            safeDelete(path.join(projectPath, 'node_modules'), 'node_modules directory');

            const lockFiles = {
                npm: 'package-lock.json',
                yarn: 'yarn.lock',
                pnpm: 'pnpm-lock.yaml',
            };

            if (lockFiles[packageManager]) {
                safeDelete(path.join(projectPath, lockFiles[packageManager]), 'lock file');
            }
        }

        // Success message
        colorLog('green', '\n✅ Project created successfully!');
        colorLog('cyan', '─'.repeat(50));
        colorLog('bright', `🎉 ${projectName} is ready to go!`);
        colorLog('yellow', '\n📋 Next steps:');
        console.log(`   1. cd ${projectName}`);
        if (cleanInstall) {
            console.log(`   2. ${packageManager} install`);
            console.log(`   3. ${packageManager} run dev`);
        } else {
            console.log(`   2. ${packageManager} run dev`);
        }

        colorLog('cyan', '\n🚀 Happy coding!');

    } catch (err) {
        colorLog('red', '\n❌ Project setup failed');
        console.error(err.message);

        // Cleanup on failure
        try {
            const projectPath = path.resolve(process.cwd(), answers?.projectName || 'failed-project');
            if (fs.existsSync(projectPath)) {
                colorLog('yellow', '🧹 Cleaning up failed installation...');
                safeDelete(projectPath, 'failed project directory');
            }
        } catch (cleanupErr) {
            colorLog('red', `Failed to cleanup: ${cleanupErr.message}`);
        }

        process.exit(1);
    }
}

// Enhanced error handling
process.on('uncaughtException', (err) => {
    colorLog('red', '\n❌ Uncaught Exception:');
    console.error(err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    colorLog('red', '\n❌ Unhandled Promise Rejection:');
    console.error('Promise:', promise);
    console.error('Reason:', reason);
    process.exit(1);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    colorLog('yellow', '\n👋 Installation cancelled by user');
    process.exit(0);
});

// Start the application
main().catch((err) => {
    colorLog('red', '\n❌ Fatal error:');
    console.error(err);
    process.exit(1);
});
