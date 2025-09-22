export const dashboardStyles = {
  container: {
    minHeight: "100vh",
    background: "#000000",
    color: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  } as React.CSSProperties,

  // Animated background effects
  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(ellipse 80% 50% at 50% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 60%),
      linear-gradient(135deg, transparent 0%, rgba(124, 58, 237, 0.1) 50%, transparent 100%)
    `,
    zIndex: -2,
  } as React.CSSProperties,

  lightBeams: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      conic-gradient(from 0deg at 50% 20%, transparent 0deg, rgba(255, 255, 255, 0.03) 60deg, transparent 120deg),
      conic-gradient(from 180deg at 50% 20%, transparent 0deg, rgba(255, 255, 255, 0.03) 60deg, transparent 120deg)
    `,
    animation: "rotate 20s linear infinite",
    zIndex: -1,
  } as React.CSSProperties,

  headerSection: {
    textAlign: "center",
    marginBottom: "40px",
    background: "rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "40px 32px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(79, 70, 229, 0.1)",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
    overflow: "hidden",
  } as React.CSSProperties,

  mainTitle: {
    fontSize: "3rem",
    fontWeight: "800",
    marginBottom: "16px",
    background: "linear-gradient(135deg, #ffffff 0%, #40E0D0 30%, #a855f7 70%, #ffffff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-1px",
    textShadow: "0 0 40px rgba(79, 70, 229, 0.3)",
    animation: "titleShimmer 4s ease-in-out infinite",
    lineHeight: "1.2",
  } as React.CSSProperties,

  subtitle: {
    fontSize: "18px",
    color: "#a1a1aa",
    fontWeight: "400",
    lineHeight: "1.7",
    maxWidth: "600px",
    margin: "0 auto",
  } as React.CSSProperties,

  card: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "32px",
    margin: "24px auto",
    maxWidth: "800px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(79, 70, 229, 0.1)",
    transition: "all 0.4s ease",
    position: "relative",
    overflow: "hidden",
  } as React.CSSProperties,

  vrPanel: {
    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "24px",
    padding: "40px 32px",
    margin: "32px auto",
    maxWidth: "1200px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(79, 70, 229, 0.2)",
  } as React.CSSProperties,

  controlPanel: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    padding: "32px",
    margin: "32px auto",
    maxWidth: "1200px",
    backdropFilter: "blur(20px)",
  } as React.CSSProperties,

  chatSection: {
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "24px",
  } as React.CSSProperties,

  aiSection: {
    background: "rgba(79, 70, 229, 0.1)",
    border: "1px solid rgba(79, 70, 229, 0.3)",
    borderRadius: "16px",
    padding: "24px",
  } as React.CSSProperties,

  lawyerDebateContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    margin: "32px auto",
    padding: "32px",
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    maxWidth: "1200px",
    backdropFilter: "blur(20px)",
  } as React.CSSProperties,

  lawyerCard: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "24px",
    minHeight: "300px",
    transition: "all 0.3s ease",
  } as React.CSSProperties,

  plaintiffCard: {
    background: "rgba(79, 70, 229, 0.1)",
    border: "1px solid rgba(79, 70, 229, 0.3)",
  } as React.CSSProperties,

  defendantCard: {
    background: "rgba(124, 58, 237, 0.1)",
    border: "1px solid rgba(124, 58, 237, 0.3)",
  } as React.CSSProperties,

  input: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "12px 16px",
    marginRight: "12px",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#ffffff",
    minWidth: "200px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  } as React.CSSProperties,

  textarea: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "14px",
    color: "#ffffff",
    width: "100%",
    minHeight: "120px",
    resize: "vertical" as const,
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    fontFamily: "inherit",
  } as React.CSSProperties,

  button: {
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    margin: "6px",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(79, 70, 229, 0.4)",
    textTransform: "none",
    letterSpacing: "0.5px",
    position: "relative",
    overflow: "hidden",
  } as React.CSSProperties,

  primaryButton: {
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "0 15px 35px rgba(79, 70, 229, 0.5)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  } as React.CSSProperties,

  dangerButton: {
    background: "linear-gradient(135deg, #EF4444, #DC2626)",
    boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)",
  } as React.CSSProperties,

  warningButton: {
    background: "linear-gradient(135deg, #F59E0B, #D97706)",
    boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)",
  } as React.CSSProperties,

  log: {
    background: "rgba(0, 0, 0, 0.7)",
    color: "#a1a1aa",
    borderRadius: "12px",
    padding: "20px",
    minHeight: "150px",
    maxHeight: "250px",
    overflowY: "auto" as const,
    marginTop: "16px",
    fontSize: "13px",
    fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  } as React.CSSProperties,

  aiVerdict: {
    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(124, 58, 237, 0.15))",
    border: "2px solid rgba(79, 70, 229, 0.4)",
    borderRadius: "16px",
    padding: "24px",
    marginTop: "24px",
    fontWeight: "600",
    fontSize: "15px",
    boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)",
    backdropFilter: "blur(20px)",
  } as React.CSSProperties,

  summary: {
    background: "linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2))",
    border: "2px solid rgba(79, 70, 229, 0.4)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)",
    fontSize: "15px",
    backdropFilter: "blur(20px)",
  } as React.CSSProperties,

  error: {
    color: "#EF4444",
    fontWeight: "600",
    marginTop: "12px",
    padding: "16px",
    background: "rgba(239, 68, 68, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    backdropFilter: "blur(10px)",
  } as React.CSSProperties,

  success: {
    color: "#10B981",
    fontWeight: "600",
    marginTop: "12px",
    padding: "16px",
    background: "rgba(16, 185, 129, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    backdropFilter: "blur(10px)",
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: "1.4rem",
    fontWeight: "800",
    marginBottom: "20px",
    color: "#ffffff",
    borderBottom: "2px solid #4F46E5",
    paddingBottom: "8px",
    textShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
  } as React.CSSProperties,

  debateContainer: {
    display: "flex",
    gap: "24px",
    marginTop: "16px",
  } as React.CSSProperties,

  lawyerColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  } as React.CSSProperties,

  bubble: {
    padding: "14px 18px",
    borderRadius: "16px",
    fontSize: "13px",
    lineHeight: "1.5",
    maxWidth: "90%",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  } as React.CSSProperties,

  plaintiffBubble: {
    background: "rgba(79, 70, 229, 0.15)",
    border: "1px solid rgba(79, 70, 229, 0.3)",
    alignSelf: "flex-start",
    boxShadow: "0 4px 15px rgba(79, 70, 229, 0.2)",
  } as React.CSSProperties,

  defendantBubble: {
    background: "rgba(124, 58, 237, 0.15)",
    border: "1px solid rgba(124, 58, 237, 0.3)",
    alignSelf: "flex-end",
    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.2)",
  } as React.CSSProperties,
};