# Google Flights Clone ✈️

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)

**Author:** Isaac Romero Romo  
**Original repository:** _private_

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Screenshots](#-screenshots)
4. [Tech Stack](#-tech-stack)
5. [Folder Structure](#-folder-structure)
6. [Quick Start](#️-quick-start)
7. [Environment Variables](#️-environment-variables)
8. [Integrations & Extensibility](#-integrations--extensibility)
9. [Testing Roadmap](#-testing-roadmap)
10. [License](#-license)
11. [Author](#️-author)

---

## ✨ Overview

Google Flights Clone is a web application built with **Next.js&nbsp;15 (App Router)** and **React&nbsp;19** that recreates the core experience of Google Flights: searching for flights and hotels, drawing routes on an interactive map, and showing results in a clean, responsive UI.

---

## 💡 Key Features

- **Real‑time flight search** via the Sky‑Scrapper API (RapidAPI).  
- **Hotel search** with mock data, ready to swap for a live provider.  
- **Interactive SVG route map** that draws flight paths on demand.  
- **Light/Dark theme** powered by shadcn/ui + Radix UI.  
- Forms built with **React Hook Form** and validated with **Zod**.  
- **Strict TypeScript**, ESLint and Prettier for rock‑solid code quality.  
- Responsive design and subtle animations with **Tailwind CSS**.  
- Minimal state management through custom React hooks.

---

## 🖼️ Screenshots

| Flight search | Results with route map | Hotel search |
| :---: | :---: | :---: |
| _flight-search.png_ | _flight-results.png_ | _hotel-search.png_ |

> Replace the placeholders with real screenshots before publishing.

---

## 🚀 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js&nbsp;15, React&nbsp;19 |
| **Language** | TypeScript&nbsp;5 |
| **Styling** | Tailwind CSS, PostCSS, Autoprefixer |
| **UI Kit** | shadcn/ui (Radix components) |
| **Icons** | lucide-react |
| **Forms** | React Hook Form + Zod |
| **HTTP / API** | Fetch API, RapidAPI (Sky‑Scrapper) |
| **Tooling** | pnpm, ESLint, Prettier |

---

## 📂 Folder Structure

```text
.
├── app/                 # Next.js App Router (routes, layouts, API handlers)
│   ├── api/             # Serverless functions
│   ├── (routes)/        # Pages and route groups
│   └── globals.css
├── components/          # Reusable UI components (shadcn)
├── hooks/               # Custom React hooks
├── lib/                 # Utility helpers
├── public/              # Static assets
└── styles/              # Tailwind/PostCSS configuration
```

---

## ⚙️ Quick Start

1. **Clone** the repo and enter it:

   ```bash
   git clone https://github.com/isaac-romero/google-flights-clone.git
   cd google-flights-clone
   ```

2. **Install** dependencies (pnpm ≥ 8 recommended):

   ```bash
   pnpm install
   ```

3. **Create** a `.env.local` file with your RapidAPI credentials:

   ```env
   # RapidAPI – Sky‑Scrapper
   RAPIDAPI_KEY=your_key_here
   RAPIDAPI_HOST=sky-scrapper.p.rapidapi.com
   ```

4. **Run** the development server:

   ```bash
   pnpm dev
   # Visit http://localhost:3000
   ```

5. **Build** for production:

   ```bash
   pnpm build && pnpm start
   ```

---

## 🗝️ Environment Variables

For this project to run, you need to add the following environment variables to your `.env.local` file:

| Name | Description | Required |
|------|-------------|:-------:|
| `RAPIDAPI_KEY` | Your RapidAPI key | ✅ |
| `RAPIDAPI_HOST` | API host (usually `sky-scrapper.p.rapidapi.com`) | ✅ |

> **Important:** In the current branch the key is hard‑coded in the API handlers. **Move it to environment variables before deploying!**

---

## 🧩 Integrations & Extensibility

- **Route Map** – `components/flight-map.tsx` draws a 2D SVG projection without external map libraries. You can swap it with Mapbox or Leaflet if needed.  
- **Hotel Data** – Fake hotel data is generated in `app/api/hotels/search/route.ts`. This can be replaced with your real provider.  
- **shadcn/ui** – Components were bootstrapped via the shadcn CLI and then hand‑tuned; this is not a generic scaffold.

---

## 🧪 Testing Roadmap

- [ ] **Unit tests** with Vitest or Jest + React Testing Library.  
- [ ] **E2E tests** with Playwright.  
- [ ] **Lighthouse CI** for performance and accessibility metrics.

---

## 🖋️ License

Released under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 🙋‍♂️ Author

| ![avatar](https://avatars.githubusercontent.com/u/000000?v=4&s=100) |
|:--:|
| **Isaac Romero Romo** |
| _Software Engineer & UX Designer_ |
| [LinkedIn](https://www.linkedin.com/in/isaacromero-catcoatdev/) |
