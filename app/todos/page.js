// app/todos/page.js  →  "/todos"
import AddTodoForm from "../components/AddTodoForm";
import TodoItem from "../components/TodoItem";
import { verifySession } from "../lib/dal";
import { getTodos } from "../lib/todos";
import styles from "./page.module.css";

export const metadata = { title: "Todos List" };


export default async function TodosPage() {
    const { userId } = await verifySession();
    const todos = await getTodos(userId); // since this is a server component, we can directly call the function to get the todos, no need to use fetchTodos() which is a server action. This is because server components can directly access server-side code and data, while client components cannot.
    return (
        <main className={styles.main}>
            <h1>Todos</h1>
            <AddTodoForm />
            <ul className={styles.list}>
                {todos.map(todo => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </main>
    );
}