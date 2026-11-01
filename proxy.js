/**
 * A proxy (called "middleware" in older Next.js versions) 
 * is a function that runs before a request reaches any page. 
 * You use it for fast, cheap decisions such as redirects.
 *  For auth it gives you a smoother experience:
 
 * Logged out visits /todos
   without proxy:  the page starts rendering → verifySession() redirects → works, but late
   with proxy:     redirected to /signin immediately, before any rendering

   It also runs on every request, 
     including link prefetches, so it must stay cheap:
     decode the cookie, never query the database.


A default export (or a named proxy export). This is the function.
A way to read the session: decrypt from your session.js with the cookie value. 
You can use req.cookies.get("session")?.value since the request object already carries the cookies.
Rules:
    Logged out and the path starts with /todos → redirect to /signin.
    Logged in and the path is /signin or /signup → redirect to /todos.
    Otherwise NextResponse.next().

 */

import { NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const PROTECTED_ROUTES = ["/todos"];

export default async function proxy(req) {
    const path = req.nextUrl.pathname;
    // read the cookie, to know there is userid
    const session = req.cookies.get("session")?.value;
    const payload = await decrypt(session);
    const userId  = payload?.userId;

    // protected and not logged in ----> redirect to "/signin"
    if((path === "/todos" || path.startsWith("/todos/")) && !userId) 
       return NextResponse.redirect(new URL("/signin", req.nextUrl));

    // auth page and logged in --->  redirect to  "/todos"
    if(userId && ["/signin", "/signup"].includes(path))
       return NextResponse.redirect(new URL("/todos", req.nextUrl));

    return NextResponse.next();
}


/**
 * A config.matcher that skips static files, 
 * so images and _next assets aren't checked. 
 * The docs give one you can reuse: 
 * '/((?!api|_next/static|_next/image|.*\\.png$).*)'.
 */

// config and matcher are exact names. Next.js reads that export by name
export const config = { matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'] };
