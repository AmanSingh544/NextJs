import { logout } from "../lib/authActions"
export default function Logout(){
    return (
        <form action={logout}>
            <button >Log Out</button>
        </form>
    )
}