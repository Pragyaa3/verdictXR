// ENHANCED STYLES - Much better UI
export const dashboardStyles  = {
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    padding: '20px',
    color: '#fff',
  } as React.CSSProperties,

  headerSection: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  } as React.CSSProperties,

  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '10px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,

  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    fontWeight: '400',
  } as React.CSSProperties,

  card: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    padding: '25px',
    margin: '20px auto',
    maxWidth: '900px',
    color: '#333',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  } as React.CSSProperties,

  // NEW: VR Integration Panel
  vrPanel: {
    background: 'rgba(0,0,0,0.8)',
    borderRadius: '15px',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '1200px',
    border: '2px solid #4CAF50',
  } as React.CSSProperties,

  // NEW: Control Panel (Chat, Evidence, etc.)
  controlPanel: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '15px',
    padding: '25px',
    margin: '20px auto',
    maxWidth: '1200px',
    color: '#333',
  } as React.CSSProperties,

  chatSection: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    border: '2px solid #e9ecef',
  } as React.CSSProperties,

  aiSection: {
    background: '#f0f8ff',
    borderRadius: '10px',
    padding: '20px',
    border: '2px solid #007bff',
  } as React.CSSProperties,

  lawyerDebateContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    margin: '24px auto',
    padding: '20px',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '15px',
    border: '2px solid #FFD700',
    color: '#333',
    maxWidth: '1200px',
  } as React.CSSProperties,

  lawyerCard: {
    background: '#f5f5f5',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #ddd',
    minHeight: '300px',
  } as React.CSSProperties,

  plaintiffCard: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    borderColor: '#1976d2',
  } as React.CSSProperties,

  defendantCard: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
    borderColor: '#c2185b',
  } as React.CSSProperties,

  input: {
    borderRadius: '8px',
    border: '2px solid #ddd',
    padding: '12px 16px',
    marginRight: '10px',
    marginBottom: '10px',
    fontSize: '14px',
    background: '#fff',
    color: '#333',
    minWidth: '200px',
    transition: 'border-color 0.3s',
  } as React.CSSProperties,

  textarea: {
    borderRadius: '8px',
    border: '2px solid #ddd',
    padding: '12px 16px',
    fontSize: '14px',
    background: '#fff',
    color: '#333',
    width: '100%',
    minHeight: '80px',
    resize: 'vertical' as const,
    transition: 'border-color 0.3s',
  } as React.CSSProperties,

  button: {
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    margin: '5px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  } as React.CSSProperties,

  primaryButton: {
    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
    padding: '15px 30px',
    fontSize: '16px',
    fontWeight: '700',
  } as React.CSSProperties,

  dangerButton: {
    background: 'linear-gradient(45deg, #f44336, #d32f2f)',
  } as React.CSSProperties,

  warningButton: {
    background: 'linear-gradient(45deg, #ff9800, #f57c00)',
  } as React.CSSProperties,

  log: {
    background: '#f8f9fa',
    color: '#333',
    borderRadius: '8px',
    padding: '15px',
    minHeight: '120px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
    marginTop: '10px',
    fontSize: '13px',
    fontFamily: 'monospace',
    border: '1px solid #ddd',
  } as React.CSSProperties,

  aiVerdict: {
    background: 'linear-gradient(135deg, #fffde7, #fff9c4)',
    color: '#333',
    border: '2px solid #FFD700',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '15px',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  } as React.CSSProperties,

  summary: {
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    fontSize: '16px',
  } as React.CSSProperties,

  error: {
    color: '#f44336',
    fontWeight: '600',
    marginTop: '8px',
    padding: '10px',
    background: 'rgba(244,67,54,0.1)',
    borderRadius: '5px',
    border: '1px solid rgba(244,67,54,0.3)',
  } as React.CSSProperties,

  success: {
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: '8px',
    padding: '10px',
    background: 'rgba(76,175,80,0.1)',
    borderRadius: '5px',
    border: '1px solid rgba(76,175,80,0.3)',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #667eea',
    paddingBottom: '5px',
  } as React.CSSProperties,
};
