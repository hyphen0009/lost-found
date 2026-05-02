import { Shield, Users, Heart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn-secondary"
        style={{
          marginBottom: '1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: 'none',
          background: 'transparent',
          padding: 0
        }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: 'var(--text-dark)',
          marginBottom: '1rem',
          fontWeight: '900'
        }}>
          About Lost & Found
        </h1>

        <p style={{
          color: 'var(--text-light)',
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Our mission is to help people reunite with their lost belongings through the power of community.
          Whether you've lost something precious or found an item that needs returning, you're in the right place.
        </p>
      </div>

      {/* Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>

        {/* Community */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'var(--primary-light)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Users size={28} color="var(--primary)" />
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
            Community Driven
          </h3>

          <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
            Built on trust and mutual support, our platform connects finders with owners quickly and securely.
          </p>
        </div>

        {/* Secure */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Shield size={28} color="#10b981" />
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
            Secure Claims
          </h3>

          <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
            Our claim verification system ensures that items are only returned to their rightful owners.
          </p>
        </div>

        {/* Respect */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Heart size={28} color="#ef4444" />
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
            Earn Respect
          </h3>

          <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
            Gain Respect Points (PTS) for returning items and help us build a positive and honest environment.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'var(--primary)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '24px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '800' }}>
          Ready to help out?
        </h2>

        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
          Join our community today and make a difference.
        </p>

        <Link
          to="/register"
          className="btn-primary"
          style={{
            background: 'white',
            color: 'var(--primary)',
            border: 'none',
            padding: '1rem 2.5rem',
            fontSize: '1.1rem'
          }}
        >
          Get Started
        </Link>
      </div>

      {/* Connect Section */}
      <div style={{
        marginTop: '3rem',
        background: 'white',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
          Created by Zaid
        </h2>

        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
          Specially built for Parul University
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <a href="https://github.com/hyphen0009" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GithubIcon size={18} /> GitHub
          </a>

          <a href="https://linkedin.com/in/md-zaid-5655b4271" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkedinIcon size={18} /> LinkedIn
          </a>

          <a href="https://instagram.com/the.zaix" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <InstagramIcon size={18} /> Instagram
          </a>
        </div>
      </div>

    </div>
  );
};

export default About;