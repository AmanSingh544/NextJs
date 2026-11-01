import Link from "next/link";


export const metadata = { title: "Posts" };


export default async function Post() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const posts = await res.json();


    return (
        <main>
            <h2>Posts List</h2>
            <ul style={{ lineHeight: 1.8 }}>
                {
                    posts.map(x => (
                        <li key={x.id}>
                            <string>{x.title}</string> - {x.body}
                            <Link href={`/posts/${x.id}`}>View Post</Link>
                        </li>
                    ))
                }
            </ul>
        </main>
    )
}