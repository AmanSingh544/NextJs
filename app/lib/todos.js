// app/lib/todos.js — now backed by Prisma instead of a JSON file
import { prisma } from "./prisma";

export async function getTodos(userId) {
    if (!userId) throw new Error("userId required");

    return prisma.todo.findMany({ where: { userId: userId }, orderBy: { id: "asc" } }); // was: read file + JSON.parse
}

export async function fetchTodosById(id, userId) {
    if (!userId) throw new Error("userId required");

    return prisma.todo.findUnique({ where: { id, userId: userId } });
}

export async function addTodo(text, userId) {
    if (!userId) throw new Error("userId required");

    return prisma.todo.create({ data: { text, userId: userId } }); // was: push + writeFile. completed defaults to false
}

export async function deleteTodo(id, userId) {
    if (!userId) throw new Error("userId required");

    return await prisma.todo.delete({ where: { id, userId: userId } });
}

export async function toogleTodo(id, userId) {
    if (!userId) throw new Error("userId required");

    const oldtodo = await prisma.todo.findUnique({ where: { id, userId: userId } });
    if (!oldtodo) return;
    return await prisma.todo.update({
        where: { id, userId: userId }, data: {
            completed: !oldtodo.completed
        }
    });
}

export async function updateTodo(id, newText, userId) {
    if (!userId) throw new Error("userId required");
    
    return await prisma.todo.update({
        where: { id, userId: userId }, data:
            { text: newText }
    });
}
