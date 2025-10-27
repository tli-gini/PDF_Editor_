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
- **API Integretion**: Communicates with Stirling PDF backend via internal API routes (proxy layer)

## 🧰 Tech Stack

- Frontend: Next.js 15 (App Router), Tailwind CSS, TypeScript, React
- API Proxy: Next.js API Routes (to call Stirling PDF endpoints securely)
- External PDF engine: Stirling PDF (via HTTP endpoints)

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
git clone https://github.com/tli-gini/PDF_Editor_.git
cd PDF_Editor_
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Configure PDF API Endpoint

Create a `.env` file:

```env
# Example: point to your local or company Stirling PDF backend

NEXT_PUBLIC_API_URL=http://stirling.internal:8080

```

## 📦 Deployment

### Vercel + Fly.io

- Frontend hosted on Vercel
- Stirling PDF backend hosted on Fly.io
- Proxy requests securely through Next.js API routes
- Suitable for demos, academic showcases, and testing

## 🧩 Integration

- Requests are routed through Next.js API routes to ensure:
  - Cross-origin safety: avoids CORS issues
  - Credential privacy: sensitive API info stays server-side
- By changing the NEXT_PUBLIC_PDF_API_URL environment variable, the same UI can connect to:
  - A public backend (e.g. Fly.io)
  - A private server (e.g. intranet Docker deployment)
- No additional backend logic or database is required
- Compatible with Stirling PDF v1.34+ (AGPL-3.0)

## 📝 Notes

- Dark mode is handled via `class="dark"` and Tailwind's `dark:` variants
- All fonts are preloaded with `next/font/google` and exposed via CSS variables
- Responsive design is implemented using Tailwind's breakpoints (`sm`, `md`, `lg`, etc.), ensuring the UI adapts smoothly from mobile to desktop screens
- Modular component architecture makes it easy to extend or adapt

## 📜 License

This project is intended for internal demonstration and academic showcase only.  
All frontend code in this repository is © PDF_Editor_2025 TaiDoc Tech Corp. All rights reserved.  
Redistribution or commercial use without permission is not allowed.

This UI integrates with [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF),  
an open-source backend licensed under the AGPL-3.0 License.  
Please refer to their repository for backend license terms.

Independently designed and developed by Gini Tong for internal and academic use.
