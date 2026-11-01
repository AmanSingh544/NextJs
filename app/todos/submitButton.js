"use client";

import {useFormStatus} from "react-dom";

export default function SubmitButton ({text, pendingText, className}) {
    const {pending} = useFormStatus();

    return (
        <button disabled={pending} className={className}>
            {pending ? pendingText : text}
        </button>
    )
}
