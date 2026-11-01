// app/layout.js — the ROOT LAYOUT (required in every Next.js app).
// It wraps EVERY page in your app. This is the one place you define
// <html> and <body>. Think of it as index.html + App.jsx combined.

// `metadata` replaces react-helmet / manually editing <head>.
// Next.js injects these into the page's <head> for you.


// export const metadata = {
//   title: {
//     default: process.env.NEXT_PUBLIC_TITLE,  // used when a page sets no title
//     template: "%s  : Todo App",     // %s = the page's own title
//   },
//   description:  "A simple todo app built while learning Next.js.",
// }

import Link from "next/link";
import Logout from "./components/Logout";
import "./global.css";
import { getSession } from "./lib/dal";

// app/layout.js (or any page)
export const metadata = {
  title: "My Todos",
  description: "A simple todo app built while learning Next.js.",
  openGraph: {
    title: "My Todos",
    description: "A simple todo app built while learning Next.js.",
    url: "https://myapp.vercel.app",
    siteName: "Todo App",
    type: "website",
    images: [
      {
        url: "https://myapp.vercel.app/og-image.png", // must be an absolute URL
        width: 1200,
        height: 630,
        alt: "Todo App preview",
      },
    ],
  },
  // X/Twitter has its own variant; Next supports it too:
  twitter: {
    card: "summary_large_image",
    title: "My Todos",
    description: "A simple todo app.",
    images: ["https://myapp.vercel.app/og-image.png"],
  },
};


export default async function RooddtLayout({ children }) {
  // `children` is whatever page the user is currently visiting.

  const session = await getSession();
  return (
    <html lang="en">
      <body >
        <nav>
          {
            session?.userId ?
              (<Logout />)
              : (<>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href={"/signin"} >SignIn</Link>
                  <Link href={"/signup"}>SignUp</Link>
                </div>
              </>)
          }

        </nav>
        <div>
          <h1>{process.env.NEXT_PUBLIC_TITLE}</h1>
          <h1>My First Next.js App</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
