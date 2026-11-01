import Link from "next/link";

export default function NotFoundTodo() {
    return (
        <div>
            <h2>Todo Not Found</h2>
            <p>The requested todo item does not exist.</p>
            <Link href="/todos">Back to Todos</Link>
        </div>
    );
}