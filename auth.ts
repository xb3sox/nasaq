import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Note: For demo/MVP, we'll check against a mock owner
        // In a real scenario you would check `profiles` and password hashes
        if (
          process.env.DEMO_EMAIL &&
          process.env.DEMO_PASSWORD &&
          email === process.env.DEMO_EMAIL &&
          password === process.env.DEMO_PASSWORD
        ) {
          return { id: "demo-owner-id", name: "Demo Owner", email: process.env.DEMO_EMAIL };
        }

        return null; // demo mode only
      },
    }),
  ],
})
