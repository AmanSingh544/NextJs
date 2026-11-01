"use server"

import { revalidatePath } from "next/cache";
import { addTodo, deleteTodo, toogleTodo, updateTodo } from "./todos";
import { validText } from "../helper/validationHelper";
import { verifySession } from "./dal";

export async function createTodo(prevState, formData) {

    const { userId } = await verifySession();   // from the cookie. The client can't influence it.
    const text = formData.get("todo");
    const trimmed = (text ?? "").trim();
    const validation = validText(trimmed);
    if (validation.error) {
        return validation;
    }
    await addTodo(trimmed, userId);
    revalidatePath("/todos");
    return { error: null, text: trimmed };
}

export async function removeTodo(id) {
    const { userId } = await verifySession();   // from the cookie. The client can't influence it.

    await deleteTodo(id, userId);
    revalidatePath("/todos");
}

export async function toggleTodo(id) {
    const { userId } = await verifySession();   // from the cookie. The client can't influence it.

    await toogleTodo(id, userId);
    revalidatePath("/todos");
}

export async function editTodo(id, text) {
    const { userId } = await verifySession();   // from the cookie. The client can't influence it.

    const trimmed = (text ?? "").trim();
    const validation = validText(trimmed);
    if (validation.error) {
        return validation
    }
    await updateTodo(id, trimmed, userId);
    revalidatePath("/todos");
    return { error: null, text: trimmed }
}
