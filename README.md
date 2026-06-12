# AQonnect — Travel eSIM Checkout

> Buy affordable travel eSIM data plans for 150+ destinations. Stay Always AQonnected.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Stripe Checkout
- **eSIM Provider**: eSIM Access API
- **Database**: SQLite + Prisma (swappable to PostgreSQL)
- **Validation**: Zod

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

**Required variables:**

| Variable | Description |
|---|---|
| `ESIM_ACCESS_BASE_URL` | eSIM Access API base URL |
| `ESIM_ACCESS_CODE` | Your eSIM Access access code |
| `ESIM_ACCESS_SECRET_KEY` | Your eSIM Access secret key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Your app URL (default: `http://localhost:3000`) |
| `DATABASE_URL` | Database connection string |

**Optional pricing variables:**

| Variable | Default | Description |
|---|---|---|
| `PRICE_MARKUP_PERCENT` | `0` | Percentage markup on provider price |
| `PRICE_FIXED_FEE_EUR` | `0` | Fixed fee in EUR added to each order |

### 3. Set up the database

```bash
npx prisma migrate dev --name init
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stripe Setup

### Get API keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy your **Secret key** → `STRIPE_SECRET_KEY`

### Local webhook testing

Install the Stripe CLI, then:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret it prints → `STRIPE_WEBHOOK_SECRET`

## eSIM Access Credentials

1. Sign up at [eSIM Access](https://esimaccess.com)
2. Get your **Access Code** → `ESIM_ACCESS_CODE`
3. Get your **Secret Key** → `ESIM_ACCESS_SECRET_KEY`

## How It Works

### Checkout Flow

1. User selects a destination country
2. App fetches available eSIM plans from eSIM Access API (server-side)
3. User selects a plan (and number of days for per-day plans)
4. User clicks "Continue to Pay"
5. Server creates a Stripe Checkout session
6. User completes payment on Stripe

### eSIM Ordering (Post-Payment)

1. Stripe sends `checkout.session.completed` webhook
2. Server verifies webhook signature
3. Server marks order as paid
4. Server calls eSIM Access API to create the eSIM order
5. eSIM details (QR code, ICCID, activation code) are stored
6. User sees results on the success page

> **Important**: eSIM orders are only created AFTER payment is confirmed. Duplicate webhooks are handled idempotently.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts       # POST - Create Stripe session
│   │   ├── esim/packages/route.ts  # GET  - Fetch eSIM packages
│   │   ├── order/status/route.ts   # GET  - Order status
│   │   └── webhooks/stripe/route.ts # POST - Stripe webhook
│   ├── cancel/page.tsx
│   ├── success/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── esim/
│   │   ├── CountrySelect.tsx
│   │   ├── DaySelector.tsx
│   │   ├── EsimCheckoutCard.tsx
│   │   └── PlanSelect.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   └── ui/
│       ├── ErrorMessage.tsx
│       ├── LoadingSpinner.tsx
│       └── SearchableSelect.tsx
├── data/
│   └── countries.ts
├── lib/
│   ├── esim-access/
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── normalize.ts
│   │   └── types.ts
│   ├── format.ts
│   ├── pricing.ts
│   ├── prisma.ts
│   └── stripe.ts
└── server/
    └── orders.ts
```

## Future Improvements

- [ ] PostgreSQL for production database
- [ ] Redis caching for package lists
- [ ] Email notifications with eSIM details
- [ ] Regional and global package support
- [ ] Admin dashboard for order management
- [ ] eSIM top-up support
- [ ] User accounts and order history
- [ ] Rate limiting on API routes
- [ ] Monitoring and error tracking (Sentry)
