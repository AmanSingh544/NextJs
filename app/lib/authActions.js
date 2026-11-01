// lib/authActions.js

// "use server" file with the signup action (login and logout come in Step 5)
"use server"
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";
import { validSignupDetails } from "../helper/validationHelper";

const SALT_ROUND = 10;

const DUMMY_HASH = await bcrypt.hash("dummy", SALT_ROUND);

export async function signup(prevState, formData) {
    const name = (formData.get("name") || "").trim();
    const email = (formData.get("email") || "").trim().toLowerCase();
    const password = formData.get("password");

    // validation
    const validation = validSignupDetails({ name, email, password });
    console.error(validation)
    if (validation.error) {
        return validation;
    }

    // hash the password
    try {
        const getEmail = await prisma.user.findUnique({ where: { email: email } });
        if (getEmail) {
            return { error: { email: "Email already exists" }, name, email }
            // two sign-ups with the same address at the same instant could both pass that check.
        };
    }
    catch (err) {
        return { error: { form: "Something went wrong, please try again" }, name, email }
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
    let user = null;

    // create the user i.e., save in the db
    try {
        user = await prisma.user.create({
            data: {
                name, email, password: hashedPassword
            }
        });
    }
    catch (err) {
        // Solution: - Prisma reports a unique violation with error code P2002, found on the caught error as e.code. 
        if (err.code === "P2002") {
            return { error: { email: "Email already exists" }, name, email }
        }
        return { error: { form: "Something went wrong, please try again" }, name, email }
    }

    // create the session
    if (user) {
        await createSession(user.id);
        // redirect ("/todos");
        redirect("/todos");
    }
}

export async function signIn(prevState, formData) {
    const email = (formData.get("email") || "").trim().toLowerCase();
    const password = formData.get("password");

    // validation
    const validation = validSignupDetails({ email, password }, true); // login is true
    console.error(validation)
    if (validation.error) {
        return validation;
    }

    let user = null;
    try {
        user = await prisma.user.findUnique({ where: { email } });   // the try wraps ONLY the risky lookup
    } catch (err) {
        console.error(err);
        return { error: { form: "Something went wrong, please try again" }, email };
    }

    const hash = user ? user.password : DUMMY_HASH;   // always compare against something real
    const ok = await bcrypt.compare(password, hash);  // one compare on every path: no timing difference

    if (!user || !ok) {
        return { error: { form: "Invalid email or password" }, email };
    }

    await createSession(user.id);
    redirect("/todos");         // last line, outside any try
}

export async function logout() {
    await deleteSession();
    redirect("/signin");
}