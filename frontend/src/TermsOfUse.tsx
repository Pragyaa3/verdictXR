// Terms of Use Component
interface TermsOfUsePageProps {
    onBack: () => void;
}

export const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onBack }) => {
    const styles = {
        container: {
            minHeight: '100vh',
            background: '#000000',
            color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },

        header: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            padding: '16px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        },

        nav: {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 32px',
        },

        logo: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '600',
            color: '#ffffff',
            gap: '8px',
        },

        logoIcon: {
            width: '28px',
            height: '28px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
        },

        backButton: {
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },

        content: {
            maxWidth: '900px',
            margin: '0 auto',
            padding: '60px 32px',
        },

        title: {
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #7C3AED 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.2',
        },

        subtitle: {
            fontSize: '16px',
            color: '#a1a1aa',
            textAlign: 'center',
            marginBottom: '48px',
            lineHeight: '1.6',
        },

        section: {
            marginBottom: '40px',
        },

        sectionTitle: {
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#ffffff',
            borderLeft: '3px solid #7C3AED',
            paddingLeft: '12px',
        },

        text: {
            fontSize: '15px',
            lineHeight: 1.7,
            marginBottom: '16px',
            color: '#a1a1aa',
        },

        list: {
            paddingLeft: '20px',
            marginBottom: '16px',
        },

        listItem: {
            fontSize: '15px',
            lineHeight: 1.7,
            color: '#a1a1aa',
            marginBottom: '8px',
        },

        highlight: {
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
        },

        warningBox: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
        },

        contactInfo: {
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '40px',
            textAlign: 'center',
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <nav style={styles.nav}>
                    <div style={styles.logo}>
                        <div style={styles.logoIcon}>⚖</div>
                        <span>VerdictXR</span>
                    </div>
                    <button
                        style={styles.backButton}
                        onClick={onBack}
                        onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.4)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        ← Back to Platform
                    </button>
                </nav>
            </header>

            <div style={styles.content}>
                <h1 style={styles.title}>Terms of Use</h1>
                <p style={styles.subtitle}>
                    Legal framework governing your use of VerdictXR's immersive education platform
                </p>

                <div style={styles.highlight}>
                    <strong style={{ color: '#ffffff' }}>Last Updated:</strong> January 2025<br />
                    <strong style={{ color: '#ffffff' }}>Effective Date:</strong> January 2025
                </div>

                <div style={styles.warningBox}>
                    <strong style={{ color: '#EF4444' }}>Educational Use Only:</strong> VerdictXR is designed for educational and training purposes. All content, AI interactions, and simulations are for learning only and do not constitute professional legal advice.
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Platform Access & Usage</h2>
                    <p style={styles.text}>
                        By accessing VerdictXR, you agree to use our VR legal education platform responsibly:
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Use authentic Internet Identity credentials for secure access</li>
                        <li style={styles.listItem}>Engage respectfully with AI legal experts and educational content</li>
                        <li style={styles.listItem}>Complete VR sessions using appropriate hardware and safety measures</li>
                        <li style={styles.listItem}>Respect intellectual property rights of educational materials</li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>VR Safety & Hardware Requirements</h2>
                    <p style={styles.text}>
                        Safe VR usage is essential for optimal learning experiences:
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Use VR headsets in appropriate physical spaces with adequate clearance</li>
                        <li style={styles.listItem}>Take regular breaks during extended courtroom simulation sessions</li>
                        <li style={styles.listItem}>Ensure your VR hardware meets minimum system requirements</li>
                        <li style={styles.listItem}>Report any technical issues or safety concerns immediately</li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>AI Legal Expert Interactions</h2>
                    <p style={styles.text}>
                        Our AI legal experts provide educational value with specific limitations:
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>AI responses are generated for educational simulation purposes only</li>
                        <li style={styles.listItem}>Do not use AI advice for actual legal decisions or real cases</li>
                        <li style={styles.listItem}>Understand that AI may have limitations or potential inaccuracies</li>
                        <li style={styles.listItem}>Seek professional legal counsel for real-world legal matters</li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Educational Content & Intellectual Property</h2>
                    <p style={styles.text}>
                        All educational materials are protected and licensed for learning use:
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Case studies and simulations are proprietary educational content</li>
                        <li style={styles.listItem}>Personal learning progress remains your intellectual property</li>
                        <li style={styles.listItem}>Sharing or redistributing platform content is prohibited</li>
                        <li style={styles.listItem}>Screenshots or recordings of VR sessions require permission</li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Blockchain & Data Integrity</h2>
                    <p style={styles.text}>
                        Our Internet Computer Protocol implementation ensures transparent operations:
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Educational achievements are recorded immutably on blockchain</li>
                        <li style={styles.listItem}>Smart contract functionality operates transparently</li>
                        <li style={styles.listItem}>Decentralized architecture ensures platform reliability</li>
                        <li style={styles.listItem}>Blockchain records cannot be altered or deleted</li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Prohibited Activities</h2>
                    <p style={styles.text}>
                        The following activities are strictly prohibited on VerdictXR:
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Attempting to breach security or access unauthorized areas</li>
                        <li style={styles.listItem}>Using the platform for actual legal practice or advice</li>
                        <li style={styles.listItem}>Sharing login credentials or circumventing authentication</li>
                        <li style={styles.listItem}>Disrupting other users' educational experiences</li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Limitation of Liability</h2>
                    <p style={styles.text}>
                        VerdictXR provides educational services with specific limitations on liability:
                    </p>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>Platform is provided "as-is" for educational purposes</li>
                        <li style={styles.listItem}>No warranties regarding AI accuracy or completeness</li>
                        <li style={styles.listItem}>Users assume responsibility for VR safety and proper usage</li>
                        <li style={styles.listItem}>Liability limited to educational service provision</li>
                    </ul>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Account Termination</h2>
                    <p style={styles.text}>
                        We reserve the right to terminate accounts that violate these terms or engage in prohibited activities.
                        Educational progress stored on blockchain remains accessible through Internet Identity.
                    </p>
                </div>

                <div style={styles.contactInfo}>
                    <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Connect With Us</h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        alignItems: 'center'
                    }}>
                        <a
                            href="https://github.com/VishalVermaa01/verdictXR"
                            style={{
                                color: '#a1a1aa',
                                fontSize: '24px',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#4F46E5';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = '#a1a1aa';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        <a
                            href="https://x.com/Pragyaxh3"
                            style={{
                                color: '#a1a1aa',
                                fontSize: '24px',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#1DA1F2';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = '#a1a1aa';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/pragyahurmade03/"
                            style={{
                                color: '#a1a1aa',
                                fontSize: '24px',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#0077B5';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = '#a1a1aa';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUsePage;  