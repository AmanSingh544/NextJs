"use client"
import SubmitButton from "../todos/submitButton";
import { editTodo, toggleTodo, removeTodo } from "../lib/action";
import Link from "next/link";
import { useState } from "react";
import styles from "./TodoItem.module.css";

import { pipeline } from '@huggingface/transformers';

export async function translateSnippet(text, id, targetLang = 'hi') {
    // 1. Detect language (or let the translation pipeline handle it)
    const detector = await pipeline('text-classification', 'Xenova/papluca-language-detector');
    const detectionResult = await detector(text);
    const detectedLang = detectionResult[0].label;

    // 2. Translate only the specific text portion
    const translator = await pipeline('translation', 'Xenova/m2m100_418M');
    const output = await translator(text, {
        src_lang: detectedLang,
        tgt_lang: targetLang,
    });

    const result = output[0].translation_text

    const targetEle = document.getElementById(`targetText_${id}`);
    targetEle.innerText = result;
    return result;
}

export async function DetectionAndTranslation(text, id) {
    const detector = await LanguageDetector.create({
        expectedInputLanguages: ["en-US", "zh"],
    });

    const results = await detector.detect(text);
    console.log(results);

    const translator = await window?.Translator.create({
        sourceLanguage: results[0].detectedLanguage,
        targetLanguage: "ko",
    });

    const translated = await translator.translate(text);

    const targetEle = document.getElementById(`targetText_${id}`);
    targetEle.innerText = translated;
}


export default function TodoItem({ todo }) {
    const [isEdit, setIsEdit] = useState(false);
    const [draft, setDraft] = useState(todo.text);
    const [error, setError] = useState(null);

    const updateTodo = async (id, formData) => {
        if (draft === todo.text) {
            setIsEdit(false); // simply close the editor
            return;
        }
        const result = await editTodo(id, draft);
        if (result.error) {
            setError(result.error)
        }
        else {
            setIsEdit(false);
            setError(null);
        }
    }

    const toggleFn = async (id) => {
        await toggleTodo(id);
    }

    const deleteFn = async (id) => {
        await removeTodo(id);
    }

    return (
        <li className={styles.row}>
            <form action={toggleFn.bind(null, todo.id)}>
                <SubmitButton className={styles.iconButton} text={todo.completed ? "✅" : "⬜"} pendingText="..." />
            </form>
            {
                isEdit ? (
                    <form className={styles.editForm} action={updateTodo.bind(null, todo.id)}>
                        <input name="text" value={draft}
                            onChange={(e) => setDraft(e.target.value)} />
                        <div className={styles.actions}>
                            <SubmitButton text={"Submit"} pendingText={"Submitting..."} />
                            <button type="button" className={styles.secondary} onClick={() => { setIsEdit(false); setError(null); setDraft(todo.text); }}>Cancel</button>
                        </div>
                        {error && <p className={styles.error} role="alert">{error}</p>}
                    </form>
                ) : (
                    <div className={styles.content}>
                        <span id={`targetText_${todo.id}`} onClick={() => DetectionAndTranslation(todo.text, todo.id)} className={todo.completed ? `${styles.text} ${styles.done}` : styles.text}>{todo.text}</span>
                        <button className={styles.secondary} onClick={() => setIsEdit(true)}>Edit</button>
                    </div>
                )
            }

            <form action={deleteFn.bind(null, todo.id)} >
                <SubmitButton className={styles.iconButton} text="🗑️" pendingText="..." />
            </form>

            <Link href={`/todos/${todo.id}`}>
                View
            </Link>
        </li>
    )
}