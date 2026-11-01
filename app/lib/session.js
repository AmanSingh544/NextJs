// app/lib/session.js

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.SESSION_SECRET;
const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; //ms - 7 day

if (!SECRET_KEY) throw new Error("Secret is missing!!");

const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY) // jose wants bytes, not a string


export async function encrypt(payload, expiresAt) {
    // here we will encrypt the JWT   
    const signed_jwt = new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(ENCODED_KEY);

    return signed_jwt;
}

export async function decrypt(token) {
    // here we will decrypt the token using that secret encoced key
    try {
        // The names encrypt and decrypt come from the docs. What the code really does is sign and verify:
        const { payload } = await jwtVerify(token, ENCODED_KEY, { algorithms: ["HS256"] });
        return payload;
    }
    catch {
        return undefined;  // bad signature, expired, garbage: all mean "no session"
    }
}

export async function createSession(userId) {
    const expiresAt = new Date(Date.now() + EXPIRATION_TIME) // a Date & days from Now
    const token = await encrypt({ userId }, expiresAt);
    const cookieStore = await cookies();   // NOTE: async in your Next.js version
    cookieStore.set("session", token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", expires: expiresAt, path: "/"
        });
}

export async function deleteSession() {
    (await cookies()).delete("session");
}
