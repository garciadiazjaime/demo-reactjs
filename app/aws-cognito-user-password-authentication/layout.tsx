export default function Layout(props: { children: React.ReactNode }) {
    return <main style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>{props.children}</main>
}
