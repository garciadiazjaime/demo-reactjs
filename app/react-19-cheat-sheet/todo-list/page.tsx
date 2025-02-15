export default function TodoList() {
    const todo = ["Create project", "Write code for the module A", "Deploy the app"];

    return (
        <div style={{ maxWidth: 420, margin: "0 auto", fontSize: 24 }}>
            <h1>Todo List</h1>
            <ul>
                {todo.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
