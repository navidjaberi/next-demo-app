# Food Corner

A small food ordering app built with **Next.js (App Router)** and **Supabase**.

**Live demo:** https://food-corner-beta-gray.vercel.app

The app has two roles:

- **Customers** browse the menu, order food, save favorites, write reviews and change their avatar.
- **Admins** manage the menu (add, edit and delete foods) and follow all orders from a dashboard.

![Home page](docs/screenshots/home.png)

## Try it

This is a demo app, so you can test the admin side with the demo owner account. Click **Owner login** in the header and sign in with:

| Role | Email | Password |
| --- | --- | --- |
| Owner (admin) | `owner@foodcorner.dev` | `foodcorner123` |

To try the customer side, sign up with any email.

## Features

- Menu with search and category filters (data is loaded on the server)
- Food detail pages with dynamic metadata
- Sign up / sign in with Supabase Auth
- Customer and admin roles, checked in the database with Row Level Security
- Admin dashboard: orders list with status filters, change order status, manage the menu
- Add and edit foods with image upload to Supabase Storage
- Cart saved in `localStorage`, checkout creates an order in the database
- Order prices are calculated on the server, not trusted from the browser
- Reviews with a 1-5 star rating and an average rating for each food
- Favorites saved per user
- Profile page with avatar upload, display name, order status, favorites and password change
- Confirm modals for signing out and deleting
- Separate "Owner login" page for the admin account
- Customers need their current password to change it
- Protected pages (`/admin`, `/profile`) using Next.js proxy
- Dark mode (follows the system setting, can be toggled and is saved in a cookie)
- Responsive layout with a mobile menu
- Row Level Security on all tables

| Menu (dark mode) | Mobile |
| --- | --- |
| ![Menu](docs/screenshots/menu-dark.png) | ![Mobile](docs/screenshots/mobile.png) |

![Admin dashboard](docs/screenshots/admin.png)

## Tech stack

- [Next.js 16](https://nextjs.org/) with the App Router, Server Components and Server Actions
- [React 19](https://react.dev/) (`useActionState`, `useTransition`)
- [Supabase](https://supabase.com/) for the database, auth and file storage
- CSS Modules with CSS variables for theming
- [lucide-react](https://lucide.dev/) for icons
- [Vitest](https://vitest.dev/) for unit tests

## Project structure

```
app/
  page.js              home page
  foods/               menu, food details, reviews and favorites
  admin/               dashboard for orders and the menu (admins only)
  cart/                cart page and checkout action
  login/               sign in / sign up
  profile/             avatar, orders, favorites and password change
components/            shared UI components
context/CartContext.js cart state (useReducer + localStorage)
lib/                   supabase clients, data functions and helpers
supabase/              database schema and seed data
proxy.js               refreshes the session and protects pages
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Run it locally

You need a free [Supabase](https://supabase.com/) project.

1. In the Supabase **SQL Editor**, run `supabase/schema.sql`, `supabase/seed.sql` and `supabase/roles-and-reviews.sql` in this order.
2. Create the owner account in **Authentication > Users > Add user** (`owner@foodcorner.dev` / `foodcorner123`, with **Auto Confirm User**) and make it an admin:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'owner@foodcorner.dev');
```

3. Copy `.env.example` to `.env.local` and add your project URL and anon key from **Project Settings > API**.
4. Install and start:

```bash
npm install
npm run dev
```

New accounts are customers by default.

## Notes

This was one of my first Next.js projects. It started with the Pages Router, Redux and Firebase, and I later rebuilt it with the App Router, Server Actions and Supabase.
