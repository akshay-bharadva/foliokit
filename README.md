# Foliokit

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A developer portfolio template you can clone and launch in minutes. Works as a **static site** out of the box, or connect **Supabase** for a full CMS with admin dashboard.

**One config file. 50+ themes. Zero lock-in.**

---

## 3-Step Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/foliokit.git
cd foliokit && npm install

# 2. Configure - edit the single config file
#    Open portfolio.config.ts and replace the demo values with yours

# 3. Launch
npm run dev        # Dev server at http://localhost:8889
npm run build      # Static export to ./out/
```

That's it. Your portfolio is live with your name, bio, projects, and experience.

---

## What You Get

### Static Mode (default, zero-config)
- Edit `portfolio.config.ts` -> everything updates
- No database, no backend, no API keys
- Deploy to GitHub Pages, Vercel, Netlify, or any static host

### Dynamic Mode (opt-in, add Supabase)
- Full admin dashboard with CMS, blog editor, and more
- Task manager, finance tracker, habit tracker, learning hub
- Supabase Auth with mandatory MFA
- Real-time content updates

---

## The Config File

`portfolio.config.ts` is the only file you need to touch. It controls:

| Section | What it does |
|---------|-------------|
| `name`, `title`, `bio` | Hero section identity |
| `logo` | Header logo (e.g., `JOHN` + `.DEV`) |
| `socialLinks` | GitHub, LinkedIn, Email, Twitter, etc. |
| `experience` | Work timeline on Home & About pages |
| `techStack` | Skills grid |
| `projects` | Featured projects with images |
| `education` | Education timeline |
| `showcase` | Deep-dive case studies |
| `services` | Contact page offerings |
| `blogPosts` | Static blog posts (Markdown) |
| `lifeUpdates` | Casual updates feed |
| `defaultTheme` | Pick from 50+ built-in themes |
| `github` | Auto-fetch repos from GitHub API |

---

## Themes

50+ curated themes included. Set your default in the config:

```typescript
defaultTheme: "theme-nord", // or any of these:
```

**Dark:** `theme-dracula`, `theme-nord`, `theme-tokyo-night`, `theme-catppuccin-mocha`, `theme-github-dark`, `theme-onedark-pro`, `theme-rose-pine`, `theme-monokai`, `theme-ayu-dark`

**Light:** `theme-solarized-light`, `theme-catppuccin-latte`, `theme-github-light`, `theme-arctic`, `theme-paper`

**Special:** `theme-cyberpunk`, `theme-ocean`, `theme-matrix`, `theme-blueprint`

**High Contrast:** `theme-hc-dark`, `theme-hc-light`

Visitors can switch themes live. Your default is just the starting point.

---

## Deploy

### GitHub Pages

1. Push to GitHub
2. Go to **Settings > Pages > Source: GitHub Actions**
3. Done. The included workflow handles the rest.

For dynamic mode, add these as GitHub Secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your deployed URL)

### Vercel / Netlify

Import the repo, add env vars if using Supabase, deploy.

### Manual

```bash
npm run build    # Outputs to ./out/
```

Upload `./out/` to any static host.

### Included GitHub Workflows

Two workflows ship in `.github/workflows/`:

| Workflow | Static mode | Dynamic mode |
|----------|-------------|--------------|
| `next-deploy.yml` | Optional — builds + deploys on push (uses mock data from `portfolio.config.ts`) | Required — injects Supabase secrets at build time |
| `keep-supabase-active.yml` | Auto-skipped — no-op if `NEXT_PUBLIC_SUPABASE_URL` secret is unset | Required — pings Supabase every 12h so the free tier doesn't pause after 7 days |

Static users can leave both files in place; the heartbeat detects the missing secret and exits without doing anything. Or delete `keep-supabase-active.yml` if you prefer a cleaner Actions tab.

---

## Dynamic Mode Setup (Optional)

Want the admin dashboard? Add Supabase:

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your keys
3. Run `db/schema.sql` in Supabase SQL Editor
4. Create a storage bucket named `assets` (public)
5. Navigate to `/admin/signup` to create your admin account

### Admin Features

| Route | Feature |
|-------|---------|
| `/admin` | Dashboard overview |
| `/admin/blog` | Blog post editor |
| `/admin/content` | Portfolio CMS |
| `/admin/tasks` | Kanban task manager |
| `/admin/finance` | Income/expense tracker |
| `/admin/habits` | Habit tracker with heatmaps |
| `/admin/learning` | Learning curriculum builder |
| `/admin/calendar` | Calendar view |
| `/admin/settings` | Site settings & themes |

---

## Project Structure

```
foliokit/
├── portfolio.config.ts        # YOUR CONFIG FILE - edit this
├── src/
│   ├── components/
│   │   ├── admin/             # Admin dashboard (~80 components)
│   │   ├── public/            # Public portfolio components
│   │   └── ui/                # Shadcn UI primitives (40+)
│   ├── lib/
│   │   ├── fallback-data.ts   # Reads from portfolio.config.ts
│   │   ├── schemas.ts         # Zod validation (50+ schemas)
│   │   └── utils.ts           # Utilities
│   ├── pages/                 # 32 pages (14 public + 18 admin)
│   ├── store/api/             # RTK Query (public + admin APIs)
│   ├── styles/globals.css     # Tailwind + 50+ theme definitions
│   └── types/index.ts         # TypeScript interfaces (150+)
├── db/schema.sql              # Supabase database schema
└── public/                    # Static assets
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 8889 |
| `npm run build` | Production build + static export |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## Tech Stack

Next.js 14 (Pages Router) | TypeScript | Tailwind CSS | Shadcn/Radix UI | Framer Motion | Redux Toolkit + RTK Query | Zod | Supabase (optional)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a Pull Request

---

## License

[MIT](LICENSE) - Use it for anything.

---

Built with Foliokit by [Akshay Bharadva](https://github.com/akshay-bharadva)
