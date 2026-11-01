import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

/**
 * cache() from React. 
 * Within one request, you might call verifySession() from the layout, 
 * the page and three components. 
 * cache makes it run once per request and 
 * reuses the answer. 
 * It does not cache across different requests or users.    
 * 
 */

export const getSession = cache(async () => {
    const cookie = (await cookies()).get("session")?.value;
    const payload = await decrypt(cookie);
    if (!payload?.userId) {
        return null
    }
    return {
        userId: payload.userId
    }
});

export const verifySession = cache(async () => {
    const session = await getSession();
    if (!session) redirect("/signin");
    return session;
});

export const getCurrentUser = cache(async () => {
    const session = await verifySession(); // or getSession();
    const currentuser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true }
    });
    console.log("Current user: ", currentuser)
    return currentuser
});