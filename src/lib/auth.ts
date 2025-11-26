import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // ✅ REQUIRED for ngrok

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
     redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`, // ✅ Explicit callback
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
     redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`, // ✅ Explicit callback
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});
