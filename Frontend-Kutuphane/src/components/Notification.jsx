function Notification({ message, type }) {
  if (!message) return null;

  const colors = {
    success: {
      bg: "#d4edda",
      text: "#155724",
      border: "#c3e6cb",
    },
    danger: {
      bg: "#f8d7da",
      text: "#721c24",
      border: "#f5c6cb",
    },
    warning: {
      bg: "#fff3cd",
      text: "#856404",
      border: "#ffeeba",
    },
    info: {
      bg: "#d1ecf1",
      text: "#0c5460",
      border: "#bee5eb",
    },
  };

  const { bg, text, border } = colors[type] || colors.info;

  return (
    <div
      style={{
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: "5px",
        padding: "10px 15px",
        marginBottom: "20px",
        maxWidth: "700px",
        margin: "20px auto",
        textAlign: "center",
        fontWeight: "500",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {message}
    </div>
  );
}

export default Notification;
