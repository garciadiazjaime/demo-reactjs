import ContactForm from "./components/form";

export default function App() {
  return (
    <main style={{ maxWidth: 600, margin: "20px auto" }}>
      <h1>Contact Form</h1>
      <ContactForm />

      <a
        href="https://github.com/garciadiazjaime/demo-reactjs/tree/main/app/react-contact-form"
        style={{
          textDecoration: "underline",
          fontSize: 24,
          display: "block",
          textAlign: "center",
          marginTop: 20,
        }}
        rel="nofollow"
      >
        github repository
      </a>
    </main>
  );
}
