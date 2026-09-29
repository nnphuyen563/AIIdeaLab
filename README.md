# AI Idea Lab 🧪✨

> **"IDEA IS ALL YOU NEED"** — Autonomous Pixel Pong Hero, AI Concept Studio & Prototype Synthesizer.

AI Idea Lab is an interactive development canvas and AI prototype studio that turns concepts into living, multi-variant UI prototypes and architectural blueprints. Built with a retro-cyberpunk arcade terminal aesthetic, real-time physics telemetry, and seamless AI synthesis.

---

## ⚡ Features

- **Autonomous Pixel Pong Simulation**: Interactive retro physics simulation rasterized directly onto an HTML5 `<canvas>` with custom 5x5 matrix bitmapped glyphs and collision audio synthesis.
- **AI Concept Studio**: Generate complete UI concepts, feasibility assessments, mockups, and functional component code using Gemini & AI models.
- **Multi-Variant Synthesis**: Synthesize multiple UI variations (Minimalist, Cyberpunk, Bento Grid, Modern SaaS) side-by-side with live iframe preview.
- **Supabase Cloud Integration**: Store, retrieve, and lock concept blueprints in cloud lockers with authentication and telemetry tracking.
- **Feasibility & Architecture Analysis**: Comprehensive technical breakdown including frontend architecture, backend schemas, security considerations, and implementation milestones.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: Vanilla CSS tokens & design systems (Retro-Cyberpunk / Neo-Brutalist Arcade Terminal)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nnphuyen563/AIIdeaLab.git
cd AIIdeaLab
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Set the following variables:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# AI API Key (Gemini)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup

Execute [`supabase_schema.sql`](supabase_schema.sql) in your Supabase SQL Editor to initialize required tables, Row Level Security policies, and performance indexes.

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

---

## 📄 License

MIT
