import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

async function getUser(email: string) {
    try {
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        return user.rows[0];
    } catch (error) {
        throw new Error("Failed to fetch user.");
    }

}

export const {
    signIn,
    signOut,
    auth
} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const validCredentials = z.object({
                    "email": z.string().email(),
                    "password": z.string().min(6)
                }).safeParse(credentials);

                if (validCredentials.success) {
                    const { email, password } = validCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) return user;
                }

                return null;
            }
        }),
    ]
});