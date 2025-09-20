export const dashboardStyles = {
  container: {
    background: "linear-gradient(135deg, #fdfaf6 0%, #f5efe6 100%)", // light beige background
    minHeight: "100vh",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    padding: "20px",
    color: "#4e342e", // deep brown text
  } as React.CSSProperties,

  headerSection: {
    textAlign: "center" as const,
    marginBottom: "30px",
    background: "linear-gradient(135deg, #fff 0%, #fdfaf6 100%)",
    borderRadius: "18px",
    padding: "32px 24px",
    boxShadow: "0 6px 28px rgba(78, 52, 46, 0.15)", // soft brown shadow
    border: "2px solid #8d6e63", // muted brown border
    maxWidth: "520px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  mainTitle: {
    fontSize: "2.4rem",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#5d4037", // elegant chocolate brown
    letterSpacing: "1px",
    textShadow: "1px 1px 2px rgba(93,64,55,0.15)", // subtle depth
  },

  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.9,
    fontWeight: "400",
    color: "#6d4c41",
  } as React.CSSProperties,

  card: {
    background: "linear-gradient(135deg, #fff 0%, #fef9f5 100%)",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(78, 52, 46, 0.1)",
    padding: "32px 24px",
    margin: "20px auto",
    maxWidth: "520px",
    color: "#4e342e",
    border: "2px solid #a1887f",
  },

  vrPanel: {
    background: "rgba(78,52,46,0.9)", // dark premium brown
    borderRadius: "15px",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "1200px",
    border: "2px solid #d7ccc8", // light coffee accent
    color: "#fff",
  } as React.CSSProperties,

  controlPanel: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "15px",
    padding: "25px",
    margin: "20px auto",
    maxWidth: "1200px",
    color: "#3e2723",
    border: "2px solid #a1887f",
  } as React.CSSProperties,

  chatSection: {
    background: "#faf3ef",
    borderRadius: "10px",
    padding: "20px",
    border: "2px solid #d7ccc8",
  } as React.CSSProperties,

  aiSection: {
    background: "#fff8e1",
    borderRadius: "10px",
    padding: "20px",
    border: "2px solid #ffb300",
  } as React.CSSProperties,

  lawyerDebateContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    margin: "24px auto",
    padding: "20px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "15px",
    border: "2px solid #a1887f",
    color: "#3e2723",
    maxWidth: "1200px",
  } as React.CSSProperties,

  lawyerCard: {
    background: "#fdf7f3",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #d7ccc8",
    minHeight: "300px",
  } as React.CSSProperties,

  plaintiffCard: {
    background: "linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)",
    borderColor: "#8d6e63",
  } as React.CSSProperties,

  defendantCard: {
    background: "linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%)",
    borderColor: "#bf360c",
  } as React.CSSProperties,

  input: {
    borderRadius: "8px",
    border: "2px solid #a1887f",
    padding: "12px 16px",
    marginRight: "10px",
    marginBottom: "10px",
    fontSize: "14px",
    background: "#fff",
    color: "#3e2723",
    minWidth: "200px",
    transition: "border-color 0.3s",
  } as React.CSSProperties,

  textarea: {
    borderRadius: "8px",
    border: "2px solid #a1887f",
    padding: "12px 16px",
    fontSize: "14px",
    background: "#fff",
    color: "#3e2723",
    width: "100%",
    minHeight: "80px",
    resize: "vertical" as const,
    transition: "border-color 0.3s",
  } as React.CSSProperties,

  button: {
    background: "linear-gradient(45deg, #795548, #5d4037)", // deep brown gradient
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    margin: "5px",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  } as React.CSSProperties,

  primaryButton: {
    background: "linear-gradient(45deg, #8d6e63, #6d4c41)",
    padding: "15px 30px",
    fontSize: "16px",
    fontWeight: "700",
  } as React.CSSProperties,

  dangerButton: {
    background: "linear-gradient(45deg, #bf360c, #d84315)",
  } as React.CSSProperties,

  warningButton: {
    background: "linear-gradient(45deg, #ffb300, #f57c00)",
  } as React.CSSProperties,

  log: {
    background: "#fdfaf6",
    color: "#3e2723",
    borderRadius: "8px",
    padding: "15px",
    minHeight: "120px",
    maxHeight: "200px",
    overflowY: "auto" as const,
    marginTop: "10px",
    fontSize: "13px",
    fontFamily: "monospace",
    border: "1px solid #d7ccc8",
  } as React.CSSProperties,

  aiVerdict: {
    background: "linear-gradient(135deg, #fffde7, #fff9c4)",
    color: "#3e2723",
    border: "2px solid #ffb300",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "15px",
    fontWeight: "600",
    fontSize: "15px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  } as React.CSSProperties,

  summary: {
    background: "linear-gradient(45deg, #6d4c41, #4e342e)",
    color: "#fff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "25px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
    fontSize: "16px",
  } as React.CSSProperties,

  error: {
    color: "#d32f2f",
    fontWeight: "600",
    marginTop: "8px",
    padding: "10px",
    background: "rgba(211,47,47,0.1)",
    borderRadius: "5px",
    border: "1px solid rgba(211,47,47,0.3)",
  } as React.CSSProperties,

  success: {
    color: "#388e3c",
    fontWeight: "600",
    marginTop: "8px",
    padding: "10px",
    background: "rgba(56,142,60,0.1)",
    borderRadius: "5px",
    border: "1px solid rgba(56,142,60,0.3)",
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#4e342e",
    borderBottom: "2px solid #8d6e63",
    paddingBottom: "5px",
  } as React.CSSProperties,

  //new
  debateContainer: {
  display: "flex",
  gap: "20px",
  marginTop: "10px"
},
  lawyerColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px"
  } as React.CSSProperties,
bubble: {
  padding: "10px 14px",
  borderRadius: "12px",
  fontSize: "13px",
  lineHeight: "1.4",
  maxWidth: "90%"
},
plaintiffBubble: {
  background: "#dbeafe", // light blue
  alignSelf: "flex-start",
  border: "1px solid #2563eb",
},
defendantBubble: {
  background: "#dcfce7", // light green
  alignSelf: "flex-end",
  border: "1px solid #16a34a",
}

};
