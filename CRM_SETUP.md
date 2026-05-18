# Inflexions Admin / CRM — Setup Guide

The Admin module is a single-tenant CRM with customers, quotes, invoices, payments, and PDF export. It lives at `/admin` and is protected by NextAuth credentials.

## 1. Provision a Postgres database (Neon)

The fastest path to a production-ready database:

1. Sign up at [neon.tech](https://console.neon.tech) (free tier is sufficient to start).
2. Create a project → pick a region close to your Vercel deployment region.
3. Copy the **pooled** connection string from the "Connection Details" panel. It looks like:
   ```
   postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require
   ```

For local development you can use the same Neon connection string, or install Postgres locally.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

Then set:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for dev, your domain in production |
| `ADMIN_USERNAME` | Username for the admin login |
| `ADMIN_PASSWORD` | Plain text for local dev, **bcrypt hash** for production |
| `ADMIN_EMAIL` | Optional — shown in the session |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public site key for the contact-form CAPTCHA (see below). Optional in dev. |
| `TURNSTILE_SECRET_KEY` | Server-side secret for verifying the CAPTCHA token. Pair with the site key. |

### Setting up Cloudflare Turnstile (public contact form CAPTCHA)

The `/contact` form registers leads into the Customer table. To stop bots
filling it, the route verifies a Cloudflare Turnstile token before writing.

1. Sign in at <https://dash.cloudflare.com> (free tier is fine; no Cloudflare-hosted domain required).
2. Go to Turnstile → Add site. Use your production hostname (e.g. `inflexions.tech`); add `localhost` as a second hostname if you want to test locally.
3. Widget mode: **Managed** (invisible most of the time).
4. Copy the **Site key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the **Secret key** into `TURNSTILE_SECRET_KEY` — both for local `.env.local` and for Vercel.

Leave both blank in dev to disable the CAPTCHA temporarily — the form still
works, only the honeypot guards against bots.

### Generating a bcrypt password hash (production)
```bash
node -e "console.log(require('bcryptjs').hashSync('your-strong-password', 10))"
```
Paste the resulting hash into `ADMIN_PASSWORD`. The system detects bcrypt hashes automatically (anything starting with `$2a$`, `$2b$`, or `$2y$`).

## 3. Run the first migration

The repo includes wrapper scripts that load `.env.local` for the Prisma CLI (which would otherwise only read `.env`):

```bash
npm run db:migrate -- --name init
```

This creates all tables (`Customer`, `Quote`, `Invoice`, `LineItem`, `Payment`, `CompanySettings`) and generates the typed Prisma client.

Other DB scripts:

| Script | What it does |
|---|---|
| `npm run db:migrate -- --name <name>` | Create + apply a new migration during dev |
| `npm run db:deploy` | Apply existing migrations in production (no schema diff) |
| `npm run db:studio` | Open Prisma Studio (visual table browser) at localhost:5555 |
| `npm run db:reset` | Drop the DB, re-apply all migrations, regenerate client |

## 4. Start the dev server

```bash
npm run dev
```

Visit `http://localhost:3000/login` and sign in with your admin credentials.

## 5. First-time configuration

After logging in, visit `/admin/settings` and fill in:
- Company name, address, contact details, tax ID
- Default tax rate
- Quote and invoice number prefixes (e.g. `Q` and `INV`)
- Bank account details
- Mobile money details

These appear on every generated PDF.

## 6. Deploying to Vercel

1. Push the branch (already done).
2. In Vercel project → Settings → Environment Variables, add the same five variables from `.env.local`. **Use the Neon pooled URL for `DATABASE_URL`.**
3. Add a Vercel build command override if needed: `prisma generate && next build` (Vercel runs `next build` by default; add `"postinstall": "prisma generate"` to `package.json` scripts if Prisma client generation is missing on builds).
4. Deploy.

After the first deploy, run the migration against production once:

```bash
DATABASE_URL="<prod-neon-url>" npx prisma migrate deploy
```

You can run this from your local machine — `migrate deploy` only applies committed migrations and is safe to re-run.

## 7. Routes overview

| Path | What it does |
|---|---|
| `/login` | Public login form (NextAuth credentials) |
| `/admin` | Dashboard — pipeline, outstanding, recent activity |
| `/admin/customers` | List + create + edit customers |
| `/admin/customers/[id]` | Customer detail — contact info, related quotes & invoices |
| `/admin/quotes` | List + create quotes |
| `/admin/quotes/[id]` | Quote detail — edit, change status, convert to invoice, download PDF |
| `/admin/invoices` | List + create invoices |
| `/admin/invoices/[id]` | Invoice detail — edit, record payments, download PDF |
| `/admin/payments` | List + record payments |
| `/admin/settings` | Company info, billing defaults, banking details |

All `/admin/*` and `/api/admin/*` routes are gated by middleware that requires `role: "admin"` on the NextAuth JWT.

## 8. Quote → Invoice workflow

1. Create a quote in **Draft** status.
2. Once content is final, mark it **Sent**.
3. When the customer agrees, mark it **Accepted** — this enables the **Convert to invoice** action.
4. Converting copies all line items into a new draft invoice.
5. Issue the invoice (mark **Sent**), then record payments as they come in.
6. When payments fully cover the invoice total, status auto-advances to **Paid**.

## 9. Line item categories

Five categories cover Inflexions' service mix:
- Consulting & Professional Services
- Managed Services
- Hardware
- Software & Licensing
- Training

Plus an "Other" catch-all. Each line item also supports a recurring billing flag (Monthly / Quarterly / Annually) for managed services.

## 10. Known limitations / future work

- Single hardcoded admin user. To support multiple users, add a `User` model to Prisma and swap the credentials provider for a DB lookup.
- No email sending (quote/invoice PDFs must be downloaded and sent manually). Wire up Nodemailer or Resend when needed.
- No file uploads (logos, signed quotes). Add Vercel Blob or S3 when needed.
- No multi-currency conversion — each quote/invoice locks its own currency string.
