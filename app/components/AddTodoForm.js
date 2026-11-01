"use client";

import { useActionState } from "react";
import { createTodo } from "../lib/action";
import SubmitButton from "../todos/submitButton";
import styles from "./AddTodoForm.module.css";

export default function AddTodoForm() {
    const [state, formAction] = useActionState(createTodo, { error: null });
    //     ↑      ↑                                 ↑            ↑
    //  latest   replaces action={createTodo}   your action   starting state
    //  return

    return (
        <form className={styles.form} action={formAction}>
            <input type="text" name="todo" defaultValue={state.text} placeholder="Enter a new todo" />
            <SubmitButton text="Add Todo" pendingText="Adding..." />
            <p className={styles.error} aria-live="polite">{state.error}</p>
        </form>
    )
};