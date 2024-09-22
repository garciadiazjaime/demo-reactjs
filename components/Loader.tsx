import tokens from "@/support/tokens";

export default function Loader() {
  return (
    <div
      style={{
        border: "4px solid #f3f3f3",
        borderTop: `4px solid ${tokens.color.primary}`,
        borderRadius: "50%",
        width: 40,
        height: 40,
        animation: "spin 2s linear infinite",
      }}
    >
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
