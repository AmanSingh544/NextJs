// app/page.js — this file maps to the "/" URL (your home page).
// A file named `page.js` is what makes a folder a visitable route.
//
// NOTE: there is no `import React from "react"` and no ReactDOM.render().
// Next.js handles mounting for you. You just export a component.

import Link from "next/link";
import Counter from "./components/Counter";

export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Hello, Next.js 👋</h1>
      {process.env.NEXT_PUBLIC_TITLE}
      <p>This page is served from <code>app/page.js</code> at the URL <code>/</code>.</p>
      <Counter />
      <Link href="/about">About page</Link>
      <Link href="/users">Users page</Link>

    </main>
  );
}
