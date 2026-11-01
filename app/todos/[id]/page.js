import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchTodosById } from "../../lib/todos";
import { verifySession } from "../../lib/dal";


export async function generateMetadata({ params }) {
  const { id } = await params;
  const { userId } = await verifySession();
  const todo = await fetchTodosById(Number(id), userId);
  const title = `${todo ? todo.text : "xyz"} ${todo?.completed ? "Completed" : ""}`;
  return {
    title: title,
  }
}

export default async function TodoDetail({ params }) {
  const { id } = await params;
  const { userId } = await verifySession();

  const todo = await fetchTodosById(Number(id), userId); // since this is a server component, we can directly call the function to get the todo by id, no need to use getTodoById() which is a server action. This is because server components can directly access server-side code and data, while client components cannot.
  if (!todo) notFound();

  return (
    <main style={{ padding: "2rem" }}>
      <Link href="/todos">← Back to Todos</Link>
      <h1>{todo.text}</h1>
      <p>Status: {todo.completed ? "✅ Done" : "⬜ Not done"}</p>
      <p style={{ color: "#888" }}>ID: {todo.id}</p>
    </main>
  );
}
