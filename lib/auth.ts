import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";


const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('hireloop-db');


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },


    emailAndPassword: {
        enabled: true,
    },

    database: mongodbAdapter(db, {
        client,
    }),
})