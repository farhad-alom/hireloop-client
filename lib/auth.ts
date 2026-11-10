import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
import { createAuthMiddleware, APIError } from "better-auth/api"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI?.trim()
if (!uri) throw new Error("MONGODB_URI is missing in .env")

const baseURL = process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000"

const client = new MongoClient(uri)
const db = client.db("hireloop-db")

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET?.trim(),
  trustedOrigins: [baseURL],
  database: mongodbAdapter(db, { client }),

  emailAndPassword: { enabled: true },

  user: {
    additionalFields: {
      role: {
        type: ['seeker', 'recruiter', 'admin'],
        input: true,
        defaultValue: 'seeker',
        required: false,
      }
    }
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const role = ctx.body?.role as string | undefined;
        if (!role || !["seeker", "recruiter", "admin"].includes(role)) {
          throw new APIError("BAD_REQUEST", { message: "Invalid role" });
        }
      }
    }),
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
    },
  },
})


