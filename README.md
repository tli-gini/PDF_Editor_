# 📄 PDF Editor

A lightweight PDF editing UI, built with Next.js and Tailwind CSS, supporting dark mode and bilingual interface.

## ✨ Features

- **Bilingual Support**: Switch between Traditional Chinese and English
- **Dark Mode**: Follows system preference or toggle manually
- **Modular Components**: Navbar, Footer, DropZone, etc.
- **Responsive Design**: Tailwind CSS with mobile-first breakpoints
- **Themed UI**: CSS variables + Google Fonts
- **API Ready**: Designed for integration with Stirling PDF

---

## 🧰 Tech Stack

| **Layer**  | **Tool / Library**                                              |
| ---------- | --------------------------------------------------------------- |
| Framework  | [Next.js (App Router)](https://nextjs.org/docs/app)             |
| Language   | TypeScript                                                      |
| Styling    | Tailwind CSS + Custom CSS Variables                             |
| Fonts      | Google Fonts via `next/font`                                    |
| Icon Set   | Material Symbols (Rounded)                                      |
| PDF Engine | [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF)  |

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/yourname/pdf-editor.git
cd pdf-editor
npm install

```

### 2. Run Development Server

```bash
npm run dev

```

### 3. (Optional) Configure PDF API Endpoint

Create a `.env.local` file:

```
NEXT_PUBLIC_PDF_API_URL=http://localhost:8000

```

---

## 📦 Deployment

### Vercel (for development preview)

> https://pdf-editor-yourname.vercel.app

- Runs on Next.js App Router
- No backend server required unless integrating with Stirling PDF
- Works with any self-hosted Stirling PDF backend via environment variable

### Docker (for internal deployment)

For internal company deployment, a minimal Docker container is provided to host the frontend UI without backend customization.

### 🐳 Build and run

```bash
docker build -t pdf-editor .
docker run -p 3000:3000 pdf-editor

```

### 📄 Dockerfile

```
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]

```

### 📄 .env.example

```
# Public API URL for Stirling PDF server
NEXT_PUBLIC_PDF_API_URL=http://localhost:8000

```

### 🧩 Integration

- Connects to an existing Stirling PDF server via `NEXT_PUBLIC_PDF_API_URL` env variable
- No database or backend logic required
- Suitable for intranet-only deployments

---

## 📝 Notes

- Dark mode is handled via `class="dark"` and Tailwind's `dark:` variants
- All fonts are preloaded with `next/font/google` and exposed via CSS variables
- Stirling PDF can be run locally via Docker or deployed to internal servers
- The frontend is deployable as a static/SSR UI for both public and internal use cases
- Responsive design is implemented using Tailwind's mobile-first breakpoints (`sm`, `md`, `lg`, etc.), ensuring the UI adapts smoothly from mobile to desktop screens

---

## 📄 License

MIT — © 2025 TaiDoc Tech Corp.

Originally developed by Gini Tong for internal use and academic showcase.
