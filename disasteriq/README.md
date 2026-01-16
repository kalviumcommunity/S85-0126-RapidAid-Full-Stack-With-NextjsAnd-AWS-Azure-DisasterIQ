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




## TypeScript, ESLint, Prettier & Pre-commit Configuration

### Strict TypeScript Configuration
We enabled strict TypeScript options such as `strict`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, and `forceConsistentCasingInFileNames` in the `tsconfig.json` file.  
These settings help catch type errors, unused code, and potential logic issues at compile time, reducing runtime bugs and improving overall code reliability.

### ESLint + Prettier Setup
ESLint is configured using Next.js core web vitals along with Prettier integration to enforce consistent code style and best practices across the codebase.  
Rules such as mandatory semicolons, double quotes, and warnings on console logs help maintain clean, readable, and professional code.  
Prettier ensures consistent formatting for indentation, quotes, and trailing commas.

### Pre-commit Hooks with Husky & lint-staged
We integrated Husky and lint-staged to automatically run ESLint and Prettier before every commit.  
This ensures that code is linted and formatted before being pushed, preventing bad code from entering the repository and maintaining team-wide consistency.

### Why This Matters
- Strict TypeScript reduces runtime errors and improves maintainability.
- ESLint and Prettier enforce clean, consistent, and readable code.
- Pre-commit hooks ensure code quality checks are never skipped.

Screenshots and logs of successful lint and pre-commit checks are included as part of this submission.

