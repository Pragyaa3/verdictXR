//frontend/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from './hooks/useAuth';
import Dashboard from './components/Dashboard';

import CourtroomVRFullPage from './components/CourtroomVRFullPage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const styles = {
    landingContainer: {
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    },

    // Animated background with light beams
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(ellipse 80% 50% at 50% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 60%),
        linear-gradient(135deg, transparent 0%, rgba(124, 58, 237, 0.1) 50%, transparent 100%)
      `,
      zIndex: -2,
    },

    // Animated light beams
    lightBeams: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        conic-gradient(from 0deg at 50% 20%, transparent 0deg, rgba(255, 255, 255, 0.03) 60deg, transparent 120deg),
        conic-gradient(from 180deg at 50% 20%, transparent 0deg, rgba(255, 255, 255, 0.03) 60deg, transparent 120deg)
      `,
      animation: 'rotate 20s linear infinite',
      zIndex: -1,
    },

    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(20px)',
      padding: '16px 0',
      zIndex: 1000,
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },

    nav: {
      maxWidth: '1400px',
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

    navLinks: {
      display: 'flex',
      gap: '32px',
      alignItems: 'center',
    },

    navLink: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      opacity: 0.8,
      transition: 'opacity 0.2s ease',
    },

    headerCtaButton: {
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },

    // Hero Section
    hero: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 32px 60px',
      textAlign: 'center',
      position: 'relative',
    },

    heroTag: {
      background: 'rgba(79, 70, 229, 0.15)',
      border: '2px solid rgba(79, 70, 229, 0.4)',
      borderRadius: '25px',
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '32px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)',
      animation: 'tagGlow 3s ease-in-out infinite alternate',
    },

    heroTitle: {
      fontSize: '4.5rem',
      fontWeight: '800',
      lineHeight: '1.1',
      marginBottom: '24px',
      letterSpacing: '-2px',
      background: 'linear-gradient(135deg, #ffffff 0%, #40E0D0 30%, #a855f7 70%, #ffffff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      maxWidth: '900px',
      textShadow: '0 0 40px rgba(79, 70, 229, 0.3)',
      animation: 'titleShimmer 4s ease-in-out infinite',
    },

    heroSubtitle: {
      fontSize: '20px',
      color: '#a1a1aa',
      marginBottom: '40px',
      maxWidth: '700px',
      lineHeight: '1.7',
      fontWeight: '400',
      animation: 'fadeInUp 1s ease-out 0.5s both',
    },

    heroAvatars: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '40px',
      animation: 'fadeInUp 1s ease-out 0.7s both',
    },

    avatarGroup: {
      display: 'flex',
      marginRight: '16px',
      filter: 'drop-shadow(0 0 10px rgba(79, 70, 229, 0.4))',
    },

    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '3px solid #000',
      marginLeft: '-8px',
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      boxShadow: '0 0 15px rgba(79, 70, 229, 0.5)',
      animation: 'avatarFloat 3s ease-in-out infinite',
    },

    trustedText: {
      fontSize: '14px',
      color: '#71717a',
      fontWeight: '500',
    },

    heroButtons: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      animation: 'fadeInUp 1s ease-out 0.9s both',
    },

    primaryButton: {
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden',
    },

    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },

    // Enhanced Stats Section with no margins
    statsSection: {
      padding: '80px 0',
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(20px)',
      border: 'none',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'relative',
      width: '100%',
    },

    statsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '80px',
      textAlign: 'center',
      padding: '0 32px',
    },

    statItem: {
      position: 'relative',
      animation: 'statCountUp 2s ease-out',
    },

    statLabel: {
      fontSize: '14px',
      color: '#71717a',
      marginBottom: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },

    statNumber: {
      fontSize: '4rem',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #4F46E5, #40E0D0, #7C3AED)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px',
      display: 'block',
      textShadow: '0 0 30px rgba(79, 70, 229, 0.5)',
      animation: 'numberGlow 3s ease-in-out infinite alternate',
    },

    statDesc: {
      fontSize: '14px',
      color: '#a1a1aa',
      fontWeight: '500',
      lineHeight: '1.4',
    },

    // Enhanced Features Section
    featuresSection: {
      padding: '120px 0',
      width: '100%',
    },

    featuresContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 32px',
    },

    featuresHeader: {
      textAlign: 'center',
      marginBottom: '80px',
      animation: 'fadeInUp 1s ease-out',
    },

    featuresTag: {
      background: 'rgba(79, 70, 229, 0.15)',
      border: '2px solid rgba(79, 70, 229, 0.4)',
      borderRadius: '25px',
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '24px',
      display: 'inline-block',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)',
    },

    featuresTitle: {
      fontSize: '3rem',
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '20px',
      lineHeight: '1.2',
      textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
    },

    // Enhanced two-column feature layout
    featureTwoColumn: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '80px',
      alignItems: 'center',
      marginBottom: '100px',
      animation: 'slideInStagger 1s ease-out',
    },

    featureContent: {
      maxWidth: '500px',
    },

    featureIcon: {
      width: '48px',
      height: '48px',
      background: 'rgba(79, 70, 229, 0.15)',
      border: '2px solid rgba(79, 70, 229, 0.4)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      marginBottom: '24px',
      boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)',
      animation: 'iconFloat 4s ease-in-out infinite',
    },

    featureTitle: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '16px',
      lineHeight: '1.3',
    },

    featureDesc: {
      fontSize: '16px',
      color: '#a1a1aa',
      lineHeight: '1.7',
      marginBottom: '24px',
    },

    learnMoreBtn: {
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
    },

    // Enhanced animated feature visual
    featureVisual: {
      width: '500px',
      height: '350px',
      background: 'rgba(15, 23, 42, 0.9)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(79, 70, 229, 0.1)',
      transform: 'perspective(1000px) rotateX(5deg)',
    },

    // Enhanced four card section
    fourCardSection: {
      padding: '120px 0',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
    },

    fourCardTitle: {
      fontSize: '3rem',
      fontWeight: '800',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '80px',
      lineHeight: '1.2',
      padding: '0 32px',
      textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
    },

    fourCardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '32px',
      padding: '0 32px',
    },

    fourCard: {
      background: 'rgba(15, 23, 42, 0.9)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '320px',
      transition: 'all 0.4s ease',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },

    fourCardVisual: {
      width: '100%',
      height: '140px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },

    fourCardItemTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '12px',
    },

    fourCardDesc: {
      fontSize: '15px',
      color: '#a1a1aa',
      lineHeight: '1.6',
    },

    // Grid features section matching "Unlock the Potential"
    gridFeaturesSection: {
      padding: '100px 32px',
      maxWidth: '1400px',
      margin: '0 auto',
    },

    gridFeaturesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '50px',
    },

    gridFeaturesTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#ffffff',
      maxWidth: '400px',
      lineHeight: '1.2',
    },

    gridFeaturesDesc: {
      fontSize: '15px',
      color: '#a1a1aa',
      maxWidth: '350px',
      lineHeight: '1.6',
    },

    gridFeatures: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
    },

    gridFeatureCard: {
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '24px',
      transition: 'all 0.3s ease',
    },

    gridFeatureIcon: {
      width: '32px',
      height: '32px',
      background: 'rgba(79, 70, 229, 0.1)',
      border: '1px solid rgba(79, 70, 229, 0.3)',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      marginBottom: '12px',
    },

    gridFeatureTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '6px',
    },

    gridFeatureDesc: {
      fontSize: '13px',
      color: '#71717a',
      lineHeight: '1.4',
    },

    // Security section with dot pattern
    securitySection: {
      padding: '100px 32px',
      textAlign: 'center',
      position: 'relative',
    },

    dotPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
      opacity: 0.4,
    },

    securityTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
    },

    securityDesc: {
      fontSize: '16px',
      color: '#a1a1aa',
      marginBottom: '50px',
      maxWidth: '500px',
      margin: '0 auto 50px auto',
      lineHeight: '1.6',
    },

    securityVisual: {
      width: '320px',
      height: '320px',
      margin: '0 auto',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    securityShield: {
      width: '160px',
      height: '160px',
      background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(124, 58, 237, 0.1) 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      animation: 'glow 3s ease-in-out infinite alternate',
      border: '2px solid rgba(79, 70, 229, 0.3)',
    },

    // FAQ Section matching screenshots
    faqSection: {
      padding: '100px 32px',
      maxWidth: '1000px',
      margin: '0 auto',
    },

    faqHeader: {
      textAlign: 'center',
      marginBottom: '60px',
    },

    faqTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '12px',
    },

    faqSubtitle: {
      fontSize: '16px',
      color: '#a1a1aa',
      lineHeight: '1.6',
    },

    faqGrid: {
      display: 'flex',
      gap: '60px',
    },

    faqList: {
      flex: 1,
    },

    faqItem: {
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '20px 0',
    },

    faqQuestion: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '8px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    faqAnswer: {
      background: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '16px',
      fontSize: '14px',
      color: '#a1a1aa',
      lineHeight: '1.5',
      marginTop: '8px',
    },

    // Testimonials matching screenshots
    testimonialsSection: {
      padding: '100px 32px',
      maxWidth: '1400px',
      margin: '0 auto',
    },

    testimonialsHeader: {
      textAlign: 'center',
      marginBottom: '60px',
    },

    testimonialsTag: {
      background: 'rgba(79, 70, 229, 0.1)',
      border: '1px solid rgba(79, 70, 229, 0.3)',
      borderRadius: '20px',
      padding: '6px 12px',
      fontSize: '11px',
      fontWeight: '500',
      color: '#ffffff',
      marginBottom: '16px',
      display: 'inline-block',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },

    testimonialsTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '12px',
    },

    testimonialsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
    },

    testimonialCard: {
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '24px',
    },

    testimonialText: {
      fontSize: '14px',
      color: '#a1a1aa',
      lineHeight: '1.6',
      marginBottom: '16px',
    },

    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },

    testimonialAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    },

    testimonialInfo: {
      flex: 1,
    },

    testimonialName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffffff',
    },

    testimonialTitle: {
      fontSize: '12px',
      color: '#71717a',
    },

    // Final CTA Section
    finalCtaSection: {
      padding: '80px 32px',
      margin: '0 32px 60px',
      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },

    finalCtaTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '12px',
      lineHeight: '1.2',
    },

    finalCtaDesc: {
      fontSize: '16px',
      color: '#a1a1aa',
      marginBottom: '32px',
      maxWidth: '500px',
      margin: '0 auto 32px auto',
      lineHeight: '1.6',
    },

    // Footer
    footer: {
      padding: '60px 32px 32px',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      background: 'rgba(0, 0, 0, 0.5)',
    },

    footerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
    },

    footerTop: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '60px',
      marginBottom: '32px',
    },

    footerBrand: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '18px',
      fontWeight: '600',
      color: '#ffffff',
      gap: '8px',
    },

    footerSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },

    footerSectionTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '6px',
    },

    footerLink: {
      fontSize: '13px',
      color: '#71717a',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
    },

    footerBottom: {
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      paddingTop: '20px',
      textAlign: 'center',
      fontSize: '13px',
      color: '#71717a',
    }
  };

  const keyframes = `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes glow {
      0% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.3); }
      100% { box-shadow: 0 0 40px rgba(79, 70, 229, 0.6), 0 0 80px rgba(124, 58, 237, 0.3); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    
    @keyframes orbit {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes orbitDot {
      from { transform: rotate(0deg) translateX(-50%); }
      to { transform: rotate(360deg) translateX(-50%); }
    }

    /* Enhanced 3D Animations */
    @keyframes float {
      0%, 100% { transform: translateZ(20px) translateY(0px) rotateY(0deg); }
      50% { transform: translateZ(30px) translateY(-10px) rotateY(180deg); }
    }

    @keyframes pulse3D {
      0%, 100% { 
        transform: translateZ(40px) rotateY(15deg) scale(1); 
        box-shadow: 0 20px 40px rgba(79, 70, 229, 0.4); 
      }
      50% { 
        transform: translateZ(50px) rotateY(25deg) scale(1.1); 
        box-shadow: 0 30px 60px rgba(79, 70, 229, 0.6); 
      }
    }

    @keyframes innerRotate {
      0%, 100% { transform: translate(-50%, -50%) rotateZ(0deg); }
      50% { transform: translate(-50%, -50%) rotateZ(180deg); }
    }

    @keyframes networkPulse {
      0%, 100% { 
        opacity: 0.4; 
        transform: translate(-50%, -50%) rotate(var(--rotation)) rotateX(var(--tilt)) scale(1); 
      }
      50% { 
        opacity: 1; 
        transform: translate(-50%, -50%) rotate(var(--rotation)) rotateX(var(--tilt)) scale(1.2); 
      }
    }

    @keyframes nodeGlow {
      0%, 100% { 
        box-shadow: 0 0 15px rgba(79, 70, 229, 0.6); 
        transform: translateX(-50%) scale(1); 
      }
      50% { 
        box-shadow: 0 0 30px rgba(79, 70, 229, 1); 
        transform: translateX(-50%) scale(1.3); 
      }
    }

    @keyframes geometricRotate {
      from { transform: translate(-50%, -50%) rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz)) rotateZ(0deg); }
      to { transform: translate(-50%, -50%) rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz)) rotateZ(360deg); }
    }

    @keyframes coreGlow {
      0% { 
        box-shadow: 0 0 40px rgba(124, 58, 237, 0.8); 
        transform: translate(-50%, -50%) translateZ(30px) scale(1); 
      }
      100% { 
        box-shadow: 0 0 60px rgba(124, 58, 237, 1), 0 0 80px rgba(79, 70, 229, 0.6); 
        transform: translate(-50%, -50%) translateZ(40px) scale(1.2); 
      }
    }

    /* Background Animations */
    @keyframes backgroundShift {
      0%, 100% { filter: hue-rotate(0deg); }
      50% { filter: hue-rotate(30deg); }
    }

    @keyframes lightBeamRotate {
      from { transform: rotate(0deg) scale(1); }
      to { transform: rotate(360deg) scale(1.1); }
    }

    @keyframes particleFloat {
      0%, 100% { transform: translateX(0px) translateY(0px); }
      25% { transform: translateX(10px) translateY(-15px); }
      50% { transform: translateX(-5px) translateY(-10px); }
      75% { transform: translateX(-10px) translateY(-5px); }
    }

    /* UI Element Animations */
    @keyframes logoGlow {
      0% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); }
      100% { box-shadow: 0 0 30px rgba(79, 70, 229, 0.8), 0 0 40px rgba(124, 58, 237, 0.4); }
    }

    @keyframes tagGlow {
      0% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.3); }
      100% { box-shadow: 0 0 30px rgba(79, 70, 229, 0.6), inset 0 0 10px rgba(79, 70, 229, 0.2); }
    }

    @keyframes titleShimmer {
      0%, 100% { filter: brightness(1) contrast(1); }
      50% { filter: brightness(1.2) contrast(1.1); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes avatarFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-5px) rotate(5deg); }
    }

    @keyframes statCountUp {
      from { transform: scale(0.5) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    @keyframes numberGlow {
      0% { filter: drop-shadow(0 0 10px rgba(79, 70, 229, 0.5)); }
      100% { filter: drop-shadow(0 0 20px rgba(79, 70, 229, 0.8)) drop-shadow(0 0 30px rgba(124, 58, 237, 0.4)); }
    }

    @keyframes slideInStagger {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0px) rotateY(0deg); }
      50% { transform: translateY(-8px) rotateY(180deg); }
    }

    /* Hover Effects */
    .hover-glow:hover {
      box-shadow: 0 0 30px rgba(79, 70, 229, 0.6), 0 0 60px rgba(124, 58, 237, 0.3) !important;
      transform: translateY(-2px) scale(1.02) !important;
    }

    .hover-3d:hover {
      transform: perspective(1000px) rotateX(10deg) rotateY(10deg) translateZ(20px) !important;
    }

    .card-hover:hover {
      transform: translateY(-15px) rotateX(5deg) !important;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(79, 70, 229, 0.3) !important;
      border-color: rgba(79, 70, 229, 0.5) !important;
    }

    .nav-link:hover::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      border-radius: 1px;
      box-shadow: 0 0 10px rgba(79, 70, 229, 0.6);
    }

    /* Scroll-triggered animations */
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(50px);
      transition: all 0.8s ease-out;
    }

    .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .stagger-1 { transition-delay: 0.1s; }
    .stagger-2 { transition-delay: 0.2s; }
    .stagger-3 { transition-delay: 0.3s; }
    .stagger-4 { transition-delay: 0.4s; }
    .stagger-5 { transition-delay: 0.5s; }
    .stagger-6 { transition-delay: 0.6s; }

    html {
  scroll-behavior: smooth;
}
  `;

  // Add scroll animation observer
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    // Observe all elements with animate-on-scroll class
    setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.landingContainer}>
        <div style={styles.heroBackground}></div>
        <div style={styles.lightBeams}></div>
        <div style={styles.particles}></div>

        {/* Enhanced Header */}
        <motion.header style={styles.header}>
          <nav style={styles.nav}>
            <motion.div style={styles.logo}>
              <div style={styles.logoIcon} className="hover-glow">⚖</div>
              <span>VerdictXR</span>
            </motion.div>

            <div style={styles.navLinks}>
              <a href="#about-section" style={styles.navLink} className="nav-link">About</a>
              <a href="#features-section" style={styles.navLink} className="nav-link">Features</a>
              <a href="#" style={styles.navLink} className="nav-link">Privacy Policy</a>
              <a href="#" style={styles.navLink} className="nav-link">Terms of Use</a>
            </div>

            <button
              style={styles.headerCtaButton}
              className="hover-glow"
              onClick={onLogin}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.3)';
              }}
            >
              Get Started
            </button>
          </nav>
        </motion.header>

        {/* Enhanced Hero Section */}
        <motion.section style={styles.hero}>
          <motion.div
            style={styles.heroTag}
            className="animate-on-scroll"
          >
            Revolutionary Legal Solutions
          </motion.div>

          <motion.h1
            style={styles.heroTitle}
            className="animate-on-scroll stagger-1"
          >
            Revolutionizing Legal Education<br />
            with Immersive VR Technology
          </motion.h1>

          <motion.p
            style={styles.heroSubtitle}
            className="animate-on-scroll stagger-2"
          >
            Experience the future of legal education with our groundbreaking VR platform. Combining photorealistic courtroom simulations with advanced AI legal experts for unprecedented immersive learning experiences.
          </motion.p>

          <motion.div
            style={styles.heroAvatars}
            className="animate-on-scroll stagger-3"
          >
            <div style={styles.avatarGroup}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    ...styles.avatar,
                    animationDelay: `${i * 0.3}s`
                  }}
                ></div>
              ))}
            </div>
            <span style={styles.trustedText}>Trusted by 1.2k+ legal professionals worldwide</span>
          </motion.div>

          <motion.div
            style={styles.heroButtons}
            className="animate-on-scroll stagger-4"
          >
            <button
              style={styles.primaryButton}
              className="hover-glow"
              onClick={onLogin}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(79, 70, 229, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
              }}
            >
              Begin VR Journey
            </button>
            <button
              style={styles.secondaryButton}
              className="hover-3d"
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.6)';
                e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              Experience Demo
            </button>
          </motion.div>
        </motion.section>

        {/* Enhanced Stats Section */}
        <motion.section style={styles.statsSection}>
          <div style={styles.statsContainer}>
            <motion.div
              style={styles.statItem}
              className="animate-on-scroll stagger-1"
            >
              <div style={styles.statLabel}>VR Simulations Completed</div>
              <span style={styles.statNumber}>2,500+</span>
              <div style={styles.statDesc}>Legal Cases & Scenarios</div>
            </motion.div>
            <motion.div
              style={styles.statItem}
              className="animate-on-scroll stagger-2"
            >
              <div style={styles.statLabel}>Educational Impact</div>
              <span style={styles.statNumber}>$2M+</span>
              <div style={styles.statDesc}>Total Learning Value Delivered</div>
            </motion.div>
            <motion.div
              style={styles.statItem}
              className="animate-on-scroll stagger-3"
            >
              <div style={styles.statLabel}>Learning Acceleration</div>
              <span style={styles.statNumber}>95%</span>
              <div style={styles.statDesc}>Faster Skill Acquisition</div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Features Section */}
        <motion.section style={styles.featuresSection} id="about-section">
          <div style={styles.featuresContainer}>
            <motion.div
              style={styles.featuresHeader}
              className="animate-on-scroll"
            >
              <div style={styles.featuresTag}>Immersive Learning Technology</div>
              <h2 style={styles.featuresTitle}>
                Revolutionizing Legal Education Through Virtual Reality
              </h2>
            </motion.div>

            {/* Enhanced Future-Forward Solutions */}
            <motion.div
              style={styles.featureTwoColumn}
              className="animate-on-scroll stagger-1"
            >
              <div style={styles.featureContent}>
                <div style={styles.featureIcon} className="hover-glow">🎯</div>
                <h3 style={styles.featureTitle}>Immersive VR Courtrooms</h3>
                <p style={styles.featureDesc}>
                  Step into photorealistic 3D courtroom environments with haptic feedback, spatial audio, and interactive legal elements. Experience authentic trial procedures with unprecedented immersion and educational depth.
                </p>
                <button style={styles.learnMoreBtn} className="hover-glow">Explore VR Features</button>
              </div>
              <div style={styles.featureVisual} className="hover-3d">
                <AnimatedGeometricPattern />
              </div>
            </motion.div>

            {/* Enhanced AI Legal System */}
            <motion.div
              style={styles.featureTwoColumn}
              className="animate-on-scroll stagger-2"
            >
              <div style={styles.featureVisual} className="hover-3d">
                <AnimatedOrbitingCircle />
              </div>
              <div style={styles.featureContent}>
                <div style={styles.featureIcon} className="hover-glow">🧠</div>
                <h3 style={styles.featureTitle}>Advanced AI Legal Experts</h3>
                <p style={styles.featureDesc}>
                  Interact with sophisticated AI lawyers trained on comprehensive legal databases. Experience dual-perspective legal analysis with prosecution and defense AI providing real-time case strategy and argumentation.
                </p>
                <button style={styles.learnMoreBtn} className="hover-glow">Meet AI Lawyers</button>
              </div>
            </motion.div>

            {/* Enhanced Blockchain Integration */}
            <motion.div
              style={styles.featureTwoColumn}
              className="animate-on-scroll stagger-3"
            >
              <div style={styles.featureContent}>
                <div style={styles.featureIcon} className="hover-glow">🔗</div>
                <h3 style={styles.featureTitle}>Blockchain-Secured Learning</h3>
                <p style={styles.featureDesc}>
                  Experience secure, decentralized legal education powered by Internet Computer Protocol. All trial records, achievements, and learning progress are immutably stored with complete transparency and security.
                </p>
                <button style={styles.learnMoreBtn} className="hover-glow">View Security</button>
              </div>
              <div style={styles.featureVisual} className="hover-3d">
                <AnimatedBlockchainNetwork />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Four Card Section */}
        <motion.section style={styles.fourCardSection} id="features-section">
          <motion.h2
            style={styles.fourCardTitle}
            className="animate-on-scroll"
          >
            Transforming Legal Education Through Innovation
          </motion.h2>

          <div style={styles.fourCardGrid}>
            <motion.div
              style={styles.fourCard}
              className="animate-on-scroll card-hover stagger-1"
            >
              <div style={styles.fourCardVisual}>
                <AnimatedOrbitingCircle />
              </div>
              <h3 style={styles.fourCardItemTitle}>Identity Verification Systems</h3>
              <p style={styles.fourCardDesc}>
                Advanced decentralized identity management ensuring complete privacy protection while maintaining secure access to all VR legal learning environments and AI consultations.
              </p>
            </motion.div>

            <motion.div
              style={styles.fourCard}
              className="animate-on-scroll card-hover stagger-2"
            >
              <div style={styles.fourCardVisual}>
                <AnimatedBlockchainNetwork />
              </div>
              <h3 style={styles.fourCardItemTitle}>Seamless VR Integration</h3>
              <p style={styles.fourCardDesc}>
                Effortlessly integrate cutting-edge VR technology into existing educational frameworks, enhancing traditional legal education with immersive 3D learning experiences.
              </p>
            </motion.div>

            <motion.div
              style={styles.fourCard}
              className="animate-on-scroll card-hover stagger-3"
            >
              <div style={styles.fourCardVisual}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '140px',
                  height: '140px',
                  background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                  borderRadius: '25px',
                  fontSize: '56px',
                  animation: 'pulse3D 3s ease-in-out infinite',
                  boxShadow: '0 0 40px rgba(79, 70, 229, 0.6)'
                }}>
                  ⚡
                </div>
              </div>
              <h3 style={styles.fourCardItemTitle}>Real-Time Analytics</h3>
              <p style={styles.fourCardDesc}>
                Monitor learning progress with comprehensive real-time analytics, tracking VR engagement, case completion rates, and skill development metrics for optimal educational outcomes.
              </p>
            </motion.div>

            <motion.div
              style={styles.fourCard}
              className="animate-on-scroll card-hover stagger-4"
            >
              <div style={styles.fourCardVisual}>
                <AnimatedNetworkNodes />
              </div>
              <h3 style={styles.fourCardItemTitle}>Infinite Scalability</h3>
              <p style={styles.fourCardDesc}>
                Enterprise-grade VR infrastructure supporting unlimited concurrent users, from individual learners to massive educational institutions with seamless performance optimization.
              </p>
          </motion.div>
      </div>
    </motion.section >

      {/* Continue with remaining sections... */ }
      < motion.section
  style = {{
            ...styles.finalCtaSection,
  margin: '0',
    width: '100%',
      padding: '120px 32px'
          }}
className = "animate-on-scroll"
  >
          <h2 style={styles.finalCtaTitle}>
            Step Into the Future of Legal Education
          </h2>
          <p style={styles.finalCtaDesc}>
            Join thousands of legal professionals already transforming their careers through immersive VR learning. Experience the most advanced legal education platform ever created.
          </p>
          <button 
            style={styles.primaryButton}
            className="hover-glow"
            onClick={onLogin}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 70, 229, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
            }}
          >
            Launch VR Experience
          </button>
        </motion.section >

  {/* Enhanced Footer */ }
  < footer style = {{
          ...styles.footer,
    padding: '80px 0 40px',
      width: '100%'
}}>
  <div style={styles.footerContainer}>
    <div style={styles.footerTop}>
      <div style={styles.footerBrand}>
        <div style={styles.logoIcon}>⚖</div>
        <span>VerdictXR</span>
      </div>

      <div style={styles.footerSection}>
        <div style={styles.footerSectionTitle}>VR Features</div>
        <a href="#" style={styles.footerLink}>Immersive Courtrooms</a>
        <a href="#" style={styles.footerLink}>AI Legal Experts</a>
        <a href="#" style={styles.footerLink}>Case Simulations</a>
      </div>

      <div style={styles.footerSection}>
        <div style={styles.footerSectionTitle}>Platform</div>
        <a href="#" style={styles.footerLink}>About Technology</a>
        <a href="#" style={styles.footerLink}>System Requirements</a>
        <a href="#" style={styles.footerLink}>Privacy & Security</a>
      </div>

      <div style={styles.footerSection}>
        <div style={styles.footerSectionTitle}>Community</div>
        <a href="#" style={styles.footerLink}>Legal Professionals</a>
        <a href="#" style={styles.footerLink}>Educational Partners</a>
        <a href="#" style={styles.footerLink}>Developer Resources</a>
      </div>
    </div>

    <div style={styles.footerBottom}>
      © 2024 VerdictXR • Powered by Internet Computer Protocol • Next-Generation VR Legal Education
    </div>
  </div>
        </footer >
      </div >
    </>
  );
};

// About Page with matching design
interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const styles = {
    aboutContainer: {
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    header: {
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(20px)',
      padding: '16px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    },

    nav: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 32px',
    },

    logo: {
      fontSize: '18px',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
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
      maxWidth: '800px',
      margin: '0 auto',
      padding: '60px 32px',
    },

    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '32px',
      background: 'linear-gradient(135deg, #ffffff 0%, #4F46E5 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },

    text: {
      fontSize: '15px',
      lineHeight: 1.7,
      marginBottom: '24px',
      color: '#a1a1aa',
    },

    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginTop: '40px',
      marginBottom: '16px',
      color: '#ffffff',
      borderBottom: '2px solid #4F46E5',
      paddingBottom: '8px',
    }
  };

  return (
    <div style={styles.aboutContainer}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <div style={styles.logo}>VerdictXR Platform</div>
          <button style={styles.backButton} onClick={onBack}>
            ← Back to Platform
          </button>
        </nav>
      </header>

      <div style={styles.content}>
        <h1 style={styles.title}>Revolutionary Legal Education Platform</h1>

        <p style={styles.text}>
          VerdictXR represents the future of legal education, combining cutting-edge virtual reality
          technology with sophisticated artificial intelligence to create unprecedented learning experiences.
          Built on the Internet Computer Protocol, our platform delivers secure, decentralized legal
          education solutions.
        </p>

        <h2 style={styles.sectionTitle}>Platform Mission</h2>
        <p style={styles.text}>
          To revolutionize legal education through immersive VR technology, providing accessible,
          comprehensive, and interactive learning experiences that prepare the next generation of
          legal professionals for complex real-world scenarios.
        </p>

        <h2 style={styles.sectionTitle}>Technical Architecture</h2>
        <p style={styles.text}>
          Frontend: React, TypeScript, Three.js for 3D rendering, WebXR for VR support<br />
          Backend: Motoko on Internet Computer Protocol<br />
          AI Services: Advanced language models with legal specialization<br />
          Authentication: Internet Identity for secure access
        </p>

        <h2 style={styles.sectionTitle}>Educational Compliance</h2>
        <p style={styles.text}>
          This platform is designed for educational and training purposes. All AI-generated
          legal analysis is for learning purposes only and should not be considered as
          professional legal advice.
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



  const handleComplete = (role, trialId) => {
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

  const navStyles = {
    dashboardNav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(20px)',
      padding: '15px 20px',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#ffffff',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },

    navButton: {
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
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