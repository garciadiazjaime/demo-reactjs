export default function Greeting({ name = "world" }: { name: string }) {
    return (
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 style={{ textTransform: "capitalize" }}>Hello, {name}!</h1>
        </div>
    );
}
