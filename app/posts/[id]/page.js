import Link from "next/link";
import { notFound} from "next/navigation";


export const metadata = { title: "Post Details" };


export async function generateStaticParams(){
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const posts = await res.json();

    return posts.slice(0,10).map(post => ({
        id: post.id.toString()
    }));  
}

export default async function PostPage({ params }) {

    const c = await params;
    console.log("params", c);
    const { id } = await params;

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { cache: "force-cache" });
    if (!res.ok) notFound();
    const post = await res.json();

    console.log("post", post);

    return (
        <main>
            <h2>Post Details</h2>
            <Link href="/posts" >Back to Posts List</Link>
            <div>
                <strong>Title:</strong> {post.title}
            </div>
            <div>
                <strong>Id:</strong> {post.userId}
            </div>
            <div>
                <strong>Body:</strong> {post.body}
            </div>
        </main>
    )
}