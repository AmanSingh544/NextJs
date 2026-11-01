export function validText(text) {
    if (!text) {
        return { error: "Todo cann't be Empty!", text }
    }
    if (text.length > 100) {
        return { error: "Todo exceeds 100 character!", text }
    }
    return { error: null, text };
}

export function validSignupDetails(user, login= false) {
    const { name, email, password } = user;
    let error = {name: null, email: null, password: null};

    // validation
    if ( !login && (!name || name === "" || name.length < 3)) {
        return {
            error: {...error, name: "Name is invalid (or less than 3 characters"}, 
            name
        }
    }
    else if (!email || email === "") {
        return {
            error: {...error, email: "Invalid Email"}, 
            email: email
        }
    }
    else if (!password || password.length < 8 || password.length > 16) {
        return {
            error: {...error, password: "Password invalid. It should be of max 16 and min 8 character long"}
        }
    }

    return {
        error: null, name, email
    }
};
