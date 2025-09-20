//frontend/src/App.tsx
import React, { useState } from 'react';
import { useInternetIdentity } from './hooks/useAuth';
import Dashboard from './components/Dashboard';
import CourtroomVRFullPage from './components/CourtroomVRFullPage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// NEW: Enhanced Landing Page Component
const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const styles = {
    landingContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5efe6 0%, #fffbe6 100%)',
      display: 'flex',
      flexDirection: 'column' as const,
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    
    header: {
      background: 'rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      padding: '20px 0',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },

    nav: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
    },

    logo: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '2rem',
      fontWeight: '700',
      color: '#6d4c41',
      textShadow: '0 2px 8px #fffbe6',
      gap: '12px',
    },

    loginButton: {
      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
      color: '#333',
      border: 'none',
      borderRadius: '25px',
      padding: '12px 30px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },

    hero: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center' as const,
    },

    heroContent: {
      maxWidth: '800px',
      color: '#6d4c41',
    },

    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#bfa14a',
      textShadow: '0 2px 8px #fffbe6',
    },

    heroSubtitle: {
      fontSize: '1.3rem',
      marginBottom: '30px',
      opacity: 0.9,
      lineHeight: 1.6,
    },

    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      marginTop: '50px',
    },

    featureCard: {
      background: '#6d4c41',
      color: '#fff',
      borderRadius: '20px',
      padding: '30px',
      border: '2px solid #bfa14a',
      textAlign: 'center' as const,
      boxShadow: '0 4px 24px rgba(191,161,74,0.10)',
    },

    featureIcon: {
      fontSize: '3rem',
      marginBottom: '15px',
      display: 'block',
    },

    featureTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '10px',
    },

    featureDesc: {
      fontSize: '0.9rem',
      opacity: 0.8,
      lineHeight: 1.5,
    },

    ctaSection: {
      background: 'rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      padding: '50px 20px',
      textAlign: 'center' as const,
      color: '#fff',
    },

    ctaTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '20px',
    },

    ctaDesc: {
      fontSize: '1.1rem',
      marginBottom: '30px',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto 30px auto',
    },

    ctaButton: {
      background: 'linear-gradient(45deg, #4CAF50, #45a049)',
      color: '#fff',
      border: 'none',
      borderRadius: '30px',
      padding: '18px 40px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    footer: {
      background: 'rgba(0,0,0,0.2)',
      color: '#bfa14a',
      textAlign: 'center' as const,
      padding: '30px 20px',
      fontSize: '0.9rem',
      opacity: 0.8,
    }
  };

  return (
    <div style={styles.landingContainer}>
      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
      <div style={styles.logo}>
  <img src={'/src/assets/logo.jpeg'} alt="VerdictXR Logo" style={{ height: 38, width: 38, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }} />
        VerdictXR
      </div>
          <button 
            style={styles.loginButton}
            onClick={onLogin}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            🔐 Login with Internet Identity
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Welcome to VerdictXR
          </h1>
          <p style={styles.heroSubtitle}>
            Immersive courtroom simulations with AI-powered lawyers and judges.<br />
            Learn law through interactive trials and get both sides of every legal argument.
          </p>

          {/* Features Grid */}
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🥽</span>
              <h3 style={styles.featureTitle}>VR Courtroom</h3>
              <p style={styles.featureDesc}>
                Experience realistic courtroom environments with interactive 3D elements
              </p>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🤖</span>
              <h3 style={styles.featureTitle}>AI Legal Experts</h3>
              <p style={styles.featureDesc}>
                Dual AI lawyers provide arguments from both sides, plus an AI judge for verdicts
              </p>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>📚</span>
              <h3 style={styles.featureTitle}>Real Law Books</h3>
              <p style={styles.featureDesc}>
                AI powered by actual legal precedents and case law for authentic education
              </p>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🎭</span>
              <h3 style={styles.featureTitle}>Multiple Roles</h3>
              <p style={styles.featureDesc}>
                Play as Judge, Plaintiff, Defendant, or Observer in interactive trials
              </p>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>📎</span>
              <h3 style={styles.featureTitle}>Evidence System</h3>
              <p style={styles.featureDesc}>
                Submit and examine evidence in 3D space with detailed documentation
              </p>
            </div>

            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>⛓️</span>
              <h3 style={styles.featureTitle}>ICP Blockchain</h3>
              <p style={styles.featureDesc}>
                Secure, decentralized trials with Internet Identity authentication
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={{ ...styles.ctaTitle, color: "#6d4c41" }}>Ready to Learn Law Through Experience?</h2>
        <p style={{ ...styles.ctaDesc, color: "#bfa14a" }}>
          Join the future of legal education. Create trials, consult AI lawyers,
          and get comprehensive legal analysis in an immersive VR environment.
        </p>
        <button 
          style={styles.ctaButton}
          onClick={onLogin}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
        >
          Start Your Legal Journey
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
  <p>© 2024 VerdictXR | Built on Internet Computer Protocol | Educational Use Only</p>
      </footer>
    </div>
  );
};

// NEW: Enhanced About Page
const AboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const styles = {
    aboutContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
      color: '#fff',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },

    header: {
      background: 'rgba(0,0,0,0.2)',
      padding: '20px 0',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },

    nav: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
    },

    logo: {
      fontSize: '1.8rem',
      fontWeight: '700',
    },

    ctaButton: {
      background: '#6d4c41',
      color: '#fff',
      border: 'none',
      borderRadius: '30px',
      padding: '18px 40px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  // ...existing code...

    title: {
      fontSize: '3rem',
      textAlign: 'center' as const,
      marginBottom: '30px',
      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },

    sectionTitle: {
      fontSize: '2rem',
      marginBottom: '20px',
      marginTop: '50px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '10px',
    },

    text: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
      marginBottom: '20px',
      opacity: 0.9,
    },

    featureList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
      marginTop: '30px',
    },

    featureItem: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '15px',
      padding: '25px',
      border: '1px solid rgba(255,255,255,0.1)',
    },

    featureIcon: {
      fontSize: '2.5rem',
      marginBottom: '15px',
      display: 'block',
    },

    featureTitle: {
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '10px',
    },

    featureDesc: {
      opacity: 0.8,
      lineHeight: 1.5,
    }
  };

  return (
    <div style={styles.aboutContainer}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>⚖️ About VR Legal Simulator</div>
          <button style={styles.backButton} onClick={onBack}>
            ← Back to Home
          </button>
        </nav>
      </header>

      <div style={styles.content}>
        <h1 style={styles.title}>About Our Platform</h1>

        <p style={styles.text}>
          VR Legal Simulator represents the future of legal education, combining cutting-edge virtual reality 
          technology with artificial intelligence to create immersive learning experiences. Built on the 
          Internet Computer Protocol (ICP), our platform offers a decentralized, secure environment for 
          legal education and simulation.
        </p>

        <h2 style={styles.sectionTitle}>🎯 Our Mission</h2>
        <p style={styles.text}>
          To revolutionize legal education by providing accessible, interactive, and comprehensive legal 
          learning experiences that prepare students, professionals, and curious individuals for real-world 
          legal scenarios through immersive technology and AI-powered guidance.
        </p>

        <h2 style={styles.sectionTitle}>🚀 Key Features</h2>
        <div style={styles.featureList}>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🏛️</span>
            <h3 style={styles.featureTitle}>Immersive VR Courtrooms</h3>
            <p style={styles.featureDesc}>
              Experience realistic courtroom environments with detailed 3D architecture, 
              interactive elements, and authentic legal atmosphere.
            </p>
          </div>

          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>⚖️</span>
            <h3 style={styles.featureTitle}>Dual AI Lawyer System</h3>
            <p style={styles.featureDesc}>
              Get balanced legal perspectives with AI lawyers arguing both plaintiff and 
              defense positions, powered by real legal databases and case law.
            </p>
          </div>

          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>👨‍⚖️</span>
            <h3 style={styles.featureTitle}>AI Judge Verdicts</h3>
            <p style={styles.featureDesc}>
              Receive comprehensive judicial analysis and verdicts from AI judges 
              trained on legal principles and precedents.
            </p>
          </div>

          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🔐</span>
            <h3 style={styles.featureTitle}>Blockchain Security</h3>
            <p style={styles.featureDesc}>
              Built on Internet Computer Protocol with Internet Identity authentication 
              for secure, decentralized trial management.
            </p>
          </div>

          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>📚</span>
            <h3 style={styles.featureTitle}>Educational Focus</h3>
            <p style={styles.featureDesc}>
              Designed specifically for learning with structured legal analysis, 
              case studies, and interactive learning pathways.
            </p>
          </div>

          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🌐</span>
            <h3 style={styles.featureTitle}>Collaborative Trials</h3>
            <p style={styles.featureDesc}>
              Support for multiple participants with different roles, enabling 
              collaborative learning and group legal simulations.
            </p>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>🛠️ Technology Stack</h2>
        <p style={styles.text}>
          <strong>Frontend:</strong> React, TypeScript, Three.js for 3D rendering, WebXR for VR support<br/>
          <strong>Backend:</strong> Motoko on Internet Computer Protocol (ICP)<br/>
          <strong>AI Services:</strong> Integration with Gemini and OpenAI APIs for legal analysis<br/>
          <strong>Authentication:</strong> Internet Identity for secure, anonymous access<br/>
          <strong>Storage:</strong> Hybrid model combining on-chain and off-chain data management
        </p>

        <h2 style={styles.sectionTitle}>📖 Educational Use</h2>
        <p style={styles.text}>
          This platform is designed for educational and training purposes. While our AI systems 
          are trained on legal databases and precedents, they should not be used as a substitute 
          for professional legal advice. Always consult qualified legal professionals for actual 
          legal matters.
        </p>

        <h2 style={styles.sectionTitle}>🎓 Target Audience</h2>
        <p style={styles.text}>
          • Law students seeking interactive learning experiences<br/>
          • Legal professionals wanting to practice courtroom skills<br/>
          • Educators looking for innovative teaching tools<br/>
          • Anyone curious about legal processes and courtroom procedures<br/>
          • Researchers studying legal education and VR applications
        </p>
      </div>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { principal, isAuthenticated, login, logout } = useInternetIdentity();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [currentTrialId, setCurrentTrialId] = useState<bigint | null>(null);
  const navigate = useNavigate();

  const handleComplete = (role: string, trialId: bigint) => {
    setSelectedRole(role);
    setCurrentTrialId(trialId);
  };

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setSelectedRole('');
    setCurrentTrialId(null);
  };


  // Navigation styles
  const navStyles = {
    dashboardNav: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      background: '#c9aa4eb0',
      backdropFilter: 'blur(10px)',
      padding: '15px 20px',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff',
    },
    
    navButton: {
      background: 'linear-gradient(45deg, #745c04b2, #745c04b2)',
      color: '#fff',
      border: 'none',
      borderRadius: '20px',
      padding: '8px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
      <Route path="/about" element={<AboutPage onBack={() => navigate('/')} />} />
      <Route path="/dashboard" element={isAuthenticated && principal ? (
        <>
          <nav style={navStyles.dashboardNav}>
            <div style={{ fontSize: '18px', fontWeight: '600'}}>
              ⚖️ VerdictXR Dashboard
            </div>
            <div>
              <button 
                style={navStyles.navButton}
                onClick={() => navigate('/about')}
              >
                📖 About
              </button>
              <button 
                style={{...navStyles.navButton, marginLeft: '10px'}}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          </nav>
          <div style={{ paddingTop: '80px' }}>
            <Dashboard principal={principal} onComplete={handleComplete} />
          </div>
        </>
      ) : <LandingPage onLogin={handleLogin} />} />
      <Route path="/vr-courtroom" element={<CourtroomVRFullPage />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;