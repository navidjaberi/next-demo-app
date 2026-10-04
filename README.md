# Food Corner

A small food ordering app built with **Next.js (App Router)** and **Supabase**.

Users can browse the menu, search and filter foods, add them to the cart and place orders. Signed in users can save favorites, add new foods with an image and see their order history.

![Home page](docs/screenshots/home.png)

## Features

- Menu with search and category filters (data is loaded on the server)
- Food detail pages with dynamic metadata
- Sign up / sign in with Supabase Auth
- Protected pages (`/add-food`, `/profile`) using Next.js proxy
- Add a new food with image upload to Supabase Storage
- Cart saved in `localStorage`, checkout creates an order in the database
- Order prices are calculated on the server, not trusted from the browser
- Favorites saved per user
- Profile page with order history, favorites and password change
- Dark mode (follows the system setting, can be toggled)
- Responsive layout with a mobile menu
- Row Level Security on all tables

| Menu (dark mode) | Mobile |
| --- | --- |
| ![Menu](docs/screenshots/menu-dark.png) | ![Mobile](docs/screenshots/mobile.png) |

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router, Server Components and Server Actions
- [React 19](https://react.dev/) (`useActionState`, `useTransition`)
- [Supabase](https://supabase.com/) for the database, auth and file storage
- CSS Modules with CSS variables for theming
- [next-themes](https://github.com/pacocoursey/next-themes) for dark mode
- [lucide-react](https://lucide.dev/) for icons
- [Vitest](https://vitest.dev/) for unit tests

## Project structure

```
app/
  page.js              home page
  foods/               menu, food details and food actions
  add-food/            add food form
  cart/                cart page and checkout action
  login/               sign in / sign up
  profile/             orders, favorites and password change
components/            shared UI components
context/CartContext.js cart state (useReducer + localStorage)
lib/                   supabase clients, data functions and helpers
supabase/              database schema and seed data
proxy.js               refreshes the session and protects pages
```

## Getting started

### 1. Create a Supabase project

1. Create a free project on [supabase.com](https://supabase.com/).
2. Open the **SQL Editor** and run `supabase/schema.sql`, then `supabase/seed.sql`.
3. In **Authentication > Providers > Email** you can turn off "Confirm email" if you want to sign in right after sign up.

### 2. Set up the project

```bash
npm install
cp .env.example .env.local
```

Put your project URL and anon key (from **Project Settings > API**) in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Deploy

The easiest way is [Vercel](https://vercel.com/new). Import the repository and add the two environment variables from `.env.local`.

## Notes

This was one of my first Next.js projects. It started with the Pages Router, Redux and Firebase, and I later rebuilt it with the App Router, Server Actions and Supabase.
