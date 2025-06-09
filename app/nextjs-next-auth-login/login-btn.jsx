import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
        <p style={{ color: "#333", fontSize: "16px", marginBottom: "10px" }}>
          Signed in as <strong>{session.user.name}</strong>
        </p>
        <button
          onClick={() => signOut()}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#FF4D4D",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
      <p style={{ color: "#333", fontSize: "16px", marginBottom: "10px" }}>Not signed in</p>
      <button
        onClick={() => signIn()}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Sign in
      </button>
    </div>
  );
}
