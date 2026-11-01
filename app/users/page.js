//app/users/page.js

export default async function UserPage() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", { cache: "force-cache"});

    // Always check the response before using it:
    if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
    }

    const users = await res.json();

    return (
        <div>
            <h2>Users List</h2>
            <ul style={{ lineHeight: 1.8 }}>
                {
                    users.map(x => (
                        <li key={x.id}>
                            <string>{x.name}</string> - {x.email}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}