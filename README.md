# Trophy Cast Marketing Site

Static landing page for the Trophy Cast waitlist built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Project Notes

- Single-page layout using content sourced from `lib/content.ts`.
- Waitlist CTA opens a `mailto:` link to `hello@trophycast.app`.
- Tailwind theme encodes Trophy Cast brand colors and typography.

## Deploying to Vercel

1. Install the Vercel CLI if you have not already:
   ```bash
   npm install -g vercel
   ```
2. Authenticate:
   ```bash
   vercel login
   ```
3. From the project root, run the first deploy (creates the project on Vercel):
   ```bash
   vercel
   ```
4. For production deploys:
   ```bash
   vercel --prod
   ```
Vercel automatically detects the Next.js app, installs dependencies, and runs `npm run build`.
