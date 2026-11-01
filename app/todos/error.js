"use client"
export default function ErrorTodo({ error , reset}) {
    return (
        <main>
            <h1>Something went wrong</h1>
            <h3>{JSON.stringify(error)}</h3>
            <button onClick={() => reset()}>Try again
            </button>
        </main>
    )
}