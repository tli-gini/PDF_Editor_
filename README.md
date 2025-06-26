# 🎞️ PDF Editor

A lightweight, modern PDF editing frontend built with **Next.js** and **Tailwind CSS**. This UI is designed for seamless integration with [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF) and supports **dark mode** and **bilingual interfaces** (Traditional Chinese / English).

🔗 **Live Demo:** [https://pdf-editor-tli-gini.vercel.app/](https://pdf-editor-tli-gini.vercel.app/)  
🎨 **Figma Design:** [PDF Editor on Figma](https://www.figma.com/design/aVkvVBivXbpm9H7WLqbM2j/PDF_Editor_?node-id=113-3&t=BMkNqFFrI0n2eWzX-1)  
_(Visual reference and layout blueprint for implementation)_

## ✨ Features

- **Bilingual Support**: Switch between Traditional Chinese and English
- **Dark Mode**: Follows system preference or toggle manually
- **Modular Components**: Navbar, Footer, ToolSidebar, DropZone, etc.
- **Responsive Design**: Tailwind CSS with mobile-first breakpoints
- **Themed UI**: CSS variables + Google Fonts
- **API Ready**: Designed for integration with Stirling PDF backend

## 🧰 Tech Stack

| **Layer**  | **Tool / Library**                                             |
| ---------- | -------------------------------------------------------------- |
| Framework  | [Next.js (App Router)](https://nextjs.org/docs/app)            |
| Language   | TypeScript                                                     |
| Styling    | Tailwind CSS + Custom CSS Variables                            |
| Fonts      | Google Fonts via `next/font`                                   |
| Icons      | [React Icons](https://react-icons.github.io/react-icons/)      |
| PDF Engine | [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF) |

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

Create a `.env.local` file:

```env
# Example for demo (public Fly.io deployment)
NEXT_PUBLIC_PDF_API_URL=https://stirling-pdf-yourname.fly.dev

# Example for internal use (company intranet)
# NEXT_PUBLIC_PDF_API_URL=http://10.0.0.1:8080
```

## 📦 Deployment Options

### Public / Portfolio Use (Vercel + Fly.io)

- Frontend hosted on Vercel
- Backend API hosted on Fly.io using the official Stirling PDF Docker image
- Suitable for demos, academic showcases, and testing
- Set `NEXT_PUBLIC_PDF_API_URL` to your Fly.io endpoint:
  ```env
  NEXT_PUBLIC_PDF_API_URL=https://stirling-pdf-yourname.fly.dev
  ```

### Internal Company Use (Docker in Intranet)

- Frontend can be containerized for deployment within an internal network
- Backend connects to a Stirling PDF instance hosted internally (e.g., `http://10.0.0.1:8080`)
- No external access required
- Example Docker deployment:
  ```bash
  docker build -t pdf-editor .
  docker run -p 3000:3000 pdf-editor
  ```

## 🐳 Dockerfile

```dockerfile
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

## 📄 .env.example

```env
# Public API URL for Stirling PDF server
NEXT_PUBLIC_PDF_API_URL=https://stirling-pdf-yourname.fly.dev
```

## 🧩 Integration

- This frontend UI is fully decoupled from the PDF processing backend.
- By changing the `NEXT_PUBLIC_PDF_API_URL` environment variable, the interface can be used with either:
  - A public backend hosted on Fly.io (for portfolio/demos), or
  - A private server hosted internally (for production/intranet use)
- No backend logic or database is required.
- Compatible with Stirling PDF v1.34+ (AGPL-3.0)

## 📝 Notes

- Dark mode is handled via `class="dark"` and Tailwind's `dark:` variants
- All fonts are preloaded with `next/font/google` and exposed via CSS variables
- Stirling PDF can be run locally via Docker or deployed to internal servers
- The frontend is deployable as a static/SSR UI for both public and internal use cases
- Responsive design is implemented using Tailwind's mobile-first breakpoints (`sm`, `md`, `lg`, etc.), ensuring the UI adapts smoothly from mobile to desktop screens

## 📜 License

This project is intended for internal demonstration and academic showcase only.  
All frontend code in this repository is © PDF_Editor_2025 TaiDoc Tech Corp. All rights reserved.  
Redistribution or commercial use without permission is not allowed.

This UI integrates with [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF),  
an open-source backend licensed under the AGPL-3.0 License.  
Please refer to their repository for backend license terms.

Independently designed and developed by Gini Tong for internal and academic use.
