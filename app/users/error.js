"use client"

export default function Error ({error, reset}){
    console.log(error, reset);

    return (
        <main>
            <h1>Something went wrong</h1>
            <h3>{JSON.stringify(error)}</h3>
            <button onClick={() => reset()}>Try again
            </button>
        </main>
    )
}