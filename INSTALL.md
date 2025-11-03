# Installation Instructions

## Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)

## Installation Steps

### 1. Clean Install (Recommended)

If you're having issues with dependencies, do a clean install:

```bash
# Remove existing node_modules and lock file
rm -rf node_modules package-lock.json

# Or on Windows:
rmdir /s /q node_modules
del package-lock.json

# Install dependencies
npm install
```

### 2. Build the Application

```bash
npm run build
```

If you get a Tailwind CSS error, make sure you have the correct versions installed:
- tailwindcss: 3.4.17 (in devDependencies)
- postcss: 8.5.6 or higher (in devDependencies)
- autoprefixer: 10.4.21 or higher (in devDependencies)

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### 4. Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Tailwind CSS Error

If you see an error about `@tailwindcss/postcss`, it means you might have Tailwind CSS v4 installed. This project uses v3.4.17.

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm run dev
```

On Windows:
```bash
set PORT=3001 && npm run dev
```

### Build Fails on Windows

Make sure you're using a recent version of Node.js (18+) and npm (9+).

Check your versions:
```bash
node --version
npm --version
```

If needed, update npm:
```bash
npm install -g npm@latest
```
