// app/signup/page.js
import { SignUpForm } from "../components/SignupForm";

/**
 * 
 * /signup page → SignupForm (client, useActionState) → signup action (server)
   1. validate name / email / password
   2. normalize the email (trim + lowercase)
   3. HASH the password with bcrypt
   4. insert the User (the DB rejects duplicate emails)
   5. createSession(user.id)  → sets the cookie
   6. redirect("/todos")
 */


export default async function  SignUpPage () {
    return (
        <SignUpForm />
    )
}