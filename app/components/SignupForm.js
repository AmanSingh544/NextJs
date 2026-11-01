"use client"

import { useActionState } from "react"
import SubmitButton from "../todos/submitButton"
import { signup } from "../lib/authActions"
import styles from "./AddTodoForm.module.css";

const ErrorText=({text}) => {
    return (
        <p className={styles.error} aria-live="polite" style={{marginBottom: "10px"}}>
            {text}
        </p>
    )
}
export function SignUpForm() {
    const [form, formAction] = useActionState(signup, {error : {}});

    return (
        <form className={styles.form} action={formAction}>
            <ErrorText text={form.error?.form} />
            <input type="text" defaultValue={form.name} name="name" placeholder="Enter user name" />
            <ErrorText text={form.error?.name} />
            <input type="email" defaultValue={form.email} name="email" placeholder="Enter email" />
            <ErrorText text={form.error?.email} />
            <input type="password" name="password" placeholder="Enter Password" />
            <ErrorText text={form.error?.password} />
            <SubmitButton text="Sign Up" pendingText="Pending..." />
        </form>
    )
}