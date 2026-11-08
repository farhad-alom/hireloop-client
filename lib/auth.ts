import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
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

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
    },
  },
})
