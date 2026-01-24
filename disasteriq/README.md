This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





## Docker Setup

### Services
- Next.js App (port 3000)
- PostgreSQL (port 5432)
- Redis (port 6379)

### Run Locally

```bash
docker-compose up --build




RapidAid – Routing Implementation

In this project, I implemented routing using the Next.js App Router.

I created public routes for the home and login pages and protected routes for the dashboard and users pages using middleware. Authentication is handled by checking a JWT token stored in cookies before allowing access to protected pages.

I implemented dynamic routing for user pages using route parameters so different user IDs render different content from the same page.

A global layout was used to provide shared navigation across all pages.

I also added a custom 404 page to handle invalid routes gracefully.

This project demonstrates clean routing, access control, and dynamic page handling using modern Next.js routing conventions.



## Feedback UI Implementation

To improve user experience and clarity, we implemented feedback layers across the application.

### Toast Notifications
Used to show instant feedback such as:
- Successful form submission
- API errors
- Save confirmations

Toasts are non-intrusive and auto-dismiss after a few seconds.

### Modals
Used for blocking actions like delete confirmation.
- Prevents accidental destructive actions
- Focus is trapped inside the modal
- Can be dismissed using Esc key

### Loaders
Used during async operations like API calls.
- Shows progress without freezing the UI
- Accessible using aria-live roles

### User Flow Demonstrated
Toast → Modal → Loader → Success/Error Toast

These feedback mechanisms improve user trust, reduce confusion, and make the app feel responsive and human.
