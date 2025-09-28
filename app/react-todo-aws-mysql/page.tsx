"use client";

import { useState, useEffect } from "react";
import {
    fetchTodosFromDB,
    addTodosToDB,
    deleteTodosFromList,
    toggleTodoInDB,
    editTodoInDB,
    deleteTodoFromDB,
} from "./todoActions";
import { Todo } from "./types";

export default function Page() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [textareaValue, setTextareaValue] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [resetTriggered, setResetTriggered] = useState(false);

    useEffect(() => {
        const fetchTodos = async () => {
            setLoading(true);
            const fetchedTodos = await fetchTodosFromDB();
            setTodos(fetchedTodos);
            setLoading(false);
        };

        fetchTodos();
    }, []);

    const addTodos = async () => {
        const newTodos = textareaValue
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, index) => ({
                id: Date.now() + index,
                text: line.trim().toLocaleLowerCase(),
                done: false,
            }));

        if (resetTriggered) {
            await deleteTodosFromList();
            setTodos(newTodos);
        } else {
            setTodos((prevTodos) => {
                const updatedTodos = [...prevTodos, ...newTodos];
                return updatedTodos;
            });
        }

        setTextareaValue("");
        setResetTriggered(false);

        await addTodosToDB(newTodos);
    };

    const toggleDone = async (id: number) => {
        setTodos((prev) => {
            const updatedTodos = prev.map((todo) =>
                todo.id === id ? { ...todo, done: !todo.done } : todo
            );
            return updatedTodos.sort((a, b) => Number(a.done) - Number(b.done));
        });

        await toggleTodoInDB(id, !todos.find((todo) => todo.id === id)?.done);
    };

    const editTodo = async (id: number, newText: string) => {
        setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
        );

        await editTodoInDB(id, newText);
    };

    const deleteTodo = async (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        await deleteTodoFromDB(id);
    };

    const startEditing = (id: number) => {
        setEditingId(id);
    };

    const stopEditing = () => {
        setEditingId(null);
    };

    const handleTextAreaKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addTodos();
            setResetTriggered(false);
        } else if (e.key === "Escape") {
            e.preventDefault();
            setResetTriggered(false);
            setTextareaValue("");
        }
    };

    const handleEditKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter" || e.key === "Escape") {
            stopEditing();
        }
    };

    const resetTodos = () => {
        const todosText = todos.map((todo) => todo.text).join("\n");
        setTextareaValue(todosText);
        setResetTriggered(true);
        setTodos([]);
    };

    return (
        <div
            className="todo-list"
            style={{
                fontFamily: "Arial, sans-serif",
                maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            <>
                <textarea
                    name="todo-input"
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    onKeyDown={handleTextAreaKeyDown} // Call addTodos on Enter key press
                    placeholder="Enter todos, one per line, and hit Enter"
                    style={{
                        width: "100%",
                        height: "40vh",
                        padding: "10px",
                        fontSize: 26,
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginBottom: "10px",
                        resize: "none",
                    }}
                />
                <button
                    onClick={resetTodos}
                    className="reset-button"
                    style={{
                        margin: "0 0 24px",
                        padding: "10px",
                        fontSize: "1rem",
                        width: "100%",
                        backgroundColor: resetTriggered ? "#CCC" : "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: resetTriggered ? "none" : "pointer",
                    }}
                    disabled={resetTriggered ? true : undefined}
                >
                    Reset
                </button>

                {loading ? (
                    <div
                        style={{ textAlign: "center", fontSize: "1.5rem", color: "#555" }}
                    >
                        Loading...
                    </div>
                ) : (
                    <ul style={{ padding: 0, listStyle: "none" }}>
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className={todo.done ? "done" : ""}
                                onDoubleClick={() => startEditing(todo.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "10px",
                                    gap: "10px",
                                    backgroundColor: todo.done ? "#f8f9fa" : "#ffffff",
                                    padding: "12px",
                                    borderRadius: "5px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    opacity: todo.done ? 0.7 : 1,
                                    transition: "background-color 0.3s, opacity 0.3s",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <button
                                        onClick={() => toggleDone(todo.id)}
                                        style={{
                                            background: todo.done ? "#28a745" : "none",
                                            color: todo.done ? "white" : "black",
                                            cursor: "pointer",
                                            width: "40px",
                                            height: "40px",
                                            fontSize: "1.2rem",
                                            border: "1px solid #ccc",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "10px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        {todo.done ? "✔️" : ""}
                                    </button>
                                    {editingId === todo.id ? (
                                        <input
                                            type="text"
                                            value={todo.text}
                                            onChange={(e) => editTodo(todo.id, e.target.value)}
                                            onKeyDown={(e) => handleEditKeyDown(e)}
                                            onBlur={stopEditing}
                                            autoFocus
                                            style={{
                                                flex: 1,
                                                fontSize: "1rem",
                                                padding: "5px",
                                                border: "1px solid #ccc",
                                                borderRadius: "5px",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                flex: 1,
                                                fontSize: "1.2rem",
                                                textTransform: "capitalize",
                                                wordBreak: "break-word",
                                                textDecoration: todo.done ? "line-through" : "none",
                                                color: todo.done ? "#6c757d" : "#212529",
                                            }}
                                        >
                                            {todo.text}
                                        </div>
                                    )}
                                </div>

                                {!todo.done ? (
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#dc3545",
                                            fontSize: "1.2rem",
                                        }}
                                    >
                                        🗑️
                                    </button>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                )}
            </>
        </div>
    );
}
