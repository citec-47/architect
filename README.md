# Architect Silas — Portfolio

Modern Next.js 15 portfolio for an architecture studio.
Dark, GLASSHAVEN-style design applied across every project, with a full admin dashboard for managing projects, services, room breakdowns, images, and videos.

## Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: NeonDB (serverless PostgreSQL) via `@neondatabase/serverless`
- **Media**: Cloudinary (images + videos)
- **Auth**: Cookie-based JWT (`jose`) + bcrypt-hashed admin password

The previous Express + CRA codebase is preserved in `/legacy` for reference.

---

## 1. Install

```bash
npm install
```

## 2. Set up NeonDB (free)

1. Go to <https://neon.tech> and sign in with GitHub / Google.
2. Click **Create Project**. Pick any region close to you, leave Postgres version on default.
3. On the project dashboard, find **Connection Details** → **Pooled connection** (the one labelled `-pooler`). Copy the full `postgresql://...` URL.

## 3. Set up Cloudinary (free)

1. Go to <https://cloudinary.com> and create a free account.
2. After signup you land on the **Dashboard**. Look for **Product Environment Credentials**.
3. Copy three values: **Cloud Name**, **API Key**, **API Secret**.

## 4. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste in:

```env
DATABASE_URL="postgresql://...neon.tech/...?sslmode=require"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abc...xyz"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

ADMIN_EMAIL="silaschah18@gmail.com"
ADMIN_PASSWORD="ChangeThisStrongPassword!"

JWT_SECRET="run: openssl rand -base64 32   and paste output here"
```

On Windows PowerShell you can generate a strong JWT secret with:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 5. Migrate the database

```bash
npm run db:migrate
```

This will:

- Create the `projects`, `project_media`, `project_services`, `project_rooms`, `contact_messages`, and `admins` tables on your Neon database.
- Seed one admin row from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

You only need to run this once. If you re-run it later it won't overwrite your admin password.

## 6. Run the app

```bash
npm run dev
```

Open <http://localhost:3000>.

- The homepage shows all projects in the GLASSHAVEN dark-card style.
- <http://localhost:3000/login> — sign in with the admin email/password you set above.
- <http://localhost:3000/admin> — admin dashboard.

## 7. Add your first project

1. Log in.
2. Click **+ New Project**.
3. Fill in the GLASSHAVEN-style fields:
   - **Title** — the big block letters (e.g. `GLASSHAVEN`).
   - **Subtitle** — the tagline (e.g. `A NEW STANDARD OF MODERN LIVING`).
   - **Location** — shown bottom-right of the hero (e.g. `QUEBEC, CANADA`).
   - **Hero image** — upload the full-bleed image behind the title.
   - **Services (01–04)** — add each card with its number, title, description, and image.
   - **House plan** — upload the floor-plan image, set total area in m², and add each room with its area.
   - **Gallery** — drop in any number of additional images / videos.
4. Check **Featured** on one project to pin it as the homepage hero.

All media uploads go straight to your Cloudinary account.

---

## Project structure

```
app/
  page.tsx                       # Homepage — projects in GLASSHAVEN cards
  projects/[slug]/page.tsx       # Full GLASSHAVEN-style detail page
  about/, contact/, gallery/, services/
  login/page.tsx
  admin/
    layout.tsx                   # Protects everything underneath
    page.tsx                     # Dashboard
    projects/page.tsx            # List
    projects/new/page.tsx
    projects/[id]/edit/page.tsx
    messages/page.tsx
    actions.ts                   # Server actions for CRUD
  api/
    auth/login/route.ts
    auth/logout/route.ts
    contact/route.ts             # Public contact form
    upload/route.ts              # Auth-gated Cloudinary upload
components/
  SiteHeader.tsx, SiteFooter.tsx
  ProjectHeroCard.tsx            # The GLASSHAVEN dark-glass card
  ServicesGrid.tsx               # 01/02/03/04 grid
  HousePlanSection.tsx           # Room table + floor plan
  MediaGallery.tsx
  ContactForm.tsx
  admin/
    LoginForm.tsx, LogoutButton.tsx
    ProjectForm.tsx              # The big admin editor
    MediaPicker.tsx              # Cloudinary-uploading file inputs
    DeleteProjectButton.tsx
    MessageRow.tsx
lib/
  db.ts                          # neon() client
  cloudinary.ts                  # upload/destroy helpers
  auth.ts                        # JWT cookie sessions
  queries.ts                     # Typed query helpers
  types.ts                       # Project / Service / Room / Media types
database/schema.sql              # Canonical schema
scripts/migrate.ts               # Applies schema + seeds admin
```

---

## Deployment

The app is Vercel-ready:

1. Push the repo to GitHub.
2. Import on <https://vercel.com>. Set the **Root Directory** to the repo root.
3. Add the same environment variables (`DATABASE_URL`, `CLOUDINARY_*`, `ADMIN_*`, `JWT_SECRET`) under **Project → Settings → Environment Variables**.
4. Deploy.

The Neon free tier and Cloudinary free tier are both more than enough for a portfolio site.

---

## Troubleshooting

- **`DATABASE_URL is not set`** — `.env.local` is missing or the dev server was started before it was written. Restart `npm run dev`.
- **Upload returns 401** — your session expired. Log out and back in.
- **Hero image doesn't show** — confirm `res.cloudinary.com` is in `next.config.ts` under `images.remotePatterns` (it is by default).
- **Admin password forgotten** — delete the row from the `admins` table on Neon, then re-run `npm run db:migrate` to re-seed.
