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
## Local configuration

This app uses Prisma for database access and expects a `DATABASE_URL` in `.env`. For Aiven’s free SQL service, set the connection string provided by Aiven (PostgreSQL/MySQL) and then run `npx prisma db push` or rely on SQL Workbench to create the tables yourself using the schema located in `prisma/schema.prisma`.

The example schema includes `User` and `UserToken` models with initial balance defaults.

If you prefer to create the tables manually in Aiven using SQL Workbench, here is a sample PostgreSQL definition:

```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  uid TEXT UNIQUE NOT NULL,
  uname TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  balance DOUBLE PRECISION NOT NULL DEFAULT 100000
);

CREATE TABLE "UserToken" (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
```


Also set `JWT_SECRET` in `.env` to a secure random string before running the server.

When you have your credentials (host, port, user, password, dbname), update `.env` accordingly:

```dotenv
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
JWT_SECRET="somesecret"
```

If you prefer to work locally first, SQLite is configured by default (`file:./dev.db`).
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
