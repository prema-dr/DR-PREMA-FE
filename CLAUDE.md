@AGENTS.md

# Design Inspiration: Polo-Plan Landing Page

We take design inspiration for the DR_PREMA landing page from the Polo-Plan web app (read-only reference, do not modify it):

- Project root: `/home/calibraint/Desktop/POLO PLAN/Polo-Plan` (its own guide: `.claude/CLAUDE.md`)
- Landing components: `src/shared/components/landing/` — `LandingNav`, `HeroSection`, `FeaturesTicker`, `FeaturesSection`, `PlatformFeaturesSection`, `RolesSection`, `UpcomingEventsSection`, `AppBadges`, `LandingFooter` (copy in `landing.constants.ts`)
- Theme tokens: `src/assets/theme/`

Guidelines:
- Borrow layout rhythm, section ordering, spacing, typography feel and motion from Polo-Plan; do not copy code verbatim.
- Polo-Plan is React + Vite + MUI; this repo is Next.js + Tailwind-style CSS (`src/app/globals.css`). Re-implement the ideas with this repo's stack and conventions, not MUI.
- Keep DR_PREMA's own branding, content, imagery and colours (clinic/medical context) — only the design approach is borrowed.
- Read the relevant Polo-Plan component before building the matching DR_PREMA section.

# Reference: drrukkayal.com layout and style (from its header markup)

Source: header HTML/CSS copied from https://drrukkayal.com/ (Tailwind site). Use as the spacing/style reference for DR_PREMA.

## Content container (same space left and right)
- Every content wrapper: `max-w-7xl mx-auto px-4` — 80rem (1280px) max width, centered, 16px gutter on each side.
- Header: `sticky top-0 z-50 bg-white/95 backdrop-blur-md backdrop-saturate-150 shadow-sm`, inner row `flex items-center justify-between h-16` inside the container. The mobile menu panel uses the same `max-w-7xl mx-auto px-4`.
- Desktop nav shown from `lg` (`hidden lg:flex`, `gap-8`); below `lg` it collapses into a menu button.
- Do not widen `--container-7xl` in `src/app/globals.css` (keep it at 80rem) and keep left and right padding identical on every section.
- DR_PREMA intentionally uses one shared content container on every section: `mx-auto max-w-[90rem] px-[22px] md:px-8 lg:px-10` (same left and right edge as `CredentialsStrip`, user request). The navbar is `lg:max-w-[85rem]` so it lines up with it. Use this container for any new section.

## Style tokens
- Font: Inter, antialiased; body text `gray-800` (`rgb(31 41 55)`).
- Brand rose: 50 `#fdf2f6`, 100 `#fce7ef`, 200 `#facede`, 300 `#f7a3c3`, 400 `#f27aa6`, 500 `#ec5b8e`, 600 `#e8407a` (primary), 700 `#d12d66`, 800 `#b0254f`, 900 `#8f203f`, 950 `#5c0f23`.
- Secondary "sage" (actually blue): 500 `#3d90d1`, 600 `#2b7dc4`, 700 `#2366a6`.
- Gradients: hero `180deg #fdf6f8 → #fff → #f0f7fd`; warm `135deg #fdf6f8 → #fbecf0 → #f8d9e3`.
- Shadows are rose-tinted: soft `0 2px 15px -3px rgba(232,64,122,.1), 0 10px 20px -2px rgba(232,64,122,.05)`.
- Nav links `text-base font-medium text-gray-700 hover:text-rose-600 transition-colors`; section eyebrow labels `text-xs font-semibold text-rose-600 uppercase tracking-wider`; pill badges `text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full`; mega-menu card `rounded-2xl shadow-xl border border-gray-100 p-6`.
- Primary CTA is a `btn-primary` class ("Book Consultation").
