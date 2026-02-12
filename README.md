# TapLive

Location-based live order platform. Connect with local providers for real-time assistance, exploration, and verification.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth + Postgres + RLS)
- **lucide-react** icons

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once created, go to **Settings → API** and copy your:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 2. Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**.
2. Open and run the contents of `supabase/migration.sql`.
3. This creates the `profiles`, `provider_profiles`, and `orders` tables with RLS policies.

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|---|---|
| `/` | Public homepage with request widget |
| `/request` | Full request creation form |
| `/join` | Sign up / Sign in |
| `/app` | Authenticated landing (role switch) |
| `/app/customer/home` | Customer dashboard - view & create requests |
| `/app/provider/onboarding` | Multi-step provider profile setup |
| `/app/provider/home` | Provider dashboard - browse & accept requests |
| `/privacy` | Privacy policy placeholder |
| `/terms` | Terms of service placeholder |

## Project Structure

```
├── app/
│   ├── page.tsx                       # Homepage
│   ├── request/page.tsx               # Request form
│   ├── join/page.tsx                  # Auth page
│   ├── privacy/page.tsx               # Privacy placeholder
│   ├── terms/page.tsx                 # Terms placeholder
│   └── app/
│       ├── layout.tsx                 # Authenticated layout
│       ├── page.tsx                   # Role switch
│       ├── customer/home/page.tsx     # Customer dashboard
│       └── provider/
│           ├── onboarding/page.tsx    # Multi-step onboarding
│           └── home/page.tsx          # Provider dashboard
├── actions/
│   ├── auth.ts                        # Auth server actions
│   ├── provider.ts                    # Provider server actions
│   └── orders.ts                      # Order server actions
├── components/
│   ├── ui/                            # shadcn-style components
│   └── layout/                        # Layout components
├── lib/
│   ├── supabase/client.ts             # Browser Supabase client
│   ├── supabase/server.ts             # Server Supabase client
│   ├── auth.ts                        # Auth helpers
│   └── utils.ts                       # Utility functions
├── middleware.ts                       # Route protection
└── supabase/migration.sql             # Database schema + RLS
```
