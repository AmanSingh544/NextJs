import { SignInForm } from "../components/SignInForm";

/**
 * 
 * /signin page → SigninForm (client, useActionState) → signin action (server)
   1. validate  email / password
   2. normalize the email (trim + lowercase)
   4. search the User 
   5. if user exists with that email, comapre the password
    5.1. comapre with bcrypt.compare
    5.2 if matches redirect to "/todos" page
   6. if user doesn't exists- email is incorrect
 */


export default async function SignInPage(){

    return (
        <SignInForm />
    )
}