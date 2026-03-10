# Logix - task runner recipes
# Usage: just <recipe>

export PATH := env("HOME") / ".bun/bin:" + env("PATH")
bun := "bun"

# List available recipes
default:
    @just --list

# Install dependencies
install:
    {{bun}} install

# Start dev server (optional: just dev 3000)
dev port="5173":
    {{bun}} vite --port {{port}}

# Production build (typecheck + vite build)
build:
    {{bun}} tsc --noEmit
    {{bun}} vite build

# Preview production build locally
preview:
    {{bun}} vite preview

# TypeScript type check only
typecheck:
    {{bun}} tsc --noEmit

# Lint all source files
lint:
    {{bun}} eslint .

# Lint a single file
lint-file path:
    {{bun}} eslint {{path}}

# Format all files with Prettier
format:
    {{bun}} prettier --write .

# Check formatting without writing
format-check:
    {{bun}} prettier --check .

# Run all checks (typecheck + lint + format check)
check: typecheck lint format-check

# Clean build artifacts
clean:
    rm -rf dist node_modules/.vite

# Create a new topic scaffold
new-topic id:
    mkdir -p src/topics/{{id}}
    echo 'export default function {{id}}Page() {\n  return <div>{{id}}</div>;\n}' > src/topics/{{id}}/index.tsx
    @echo "Created src/topics/{{id}}/"
