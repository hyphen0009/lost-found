import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show our custom prompt if the user hasn't seen it recently
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasSeenPrompt) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now());
  };

  if (!isVisible) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt-card">
        <button className="close-btn" onClick={handleDismiss}>
          <X size={18} />
        </button>
        <div className="prompt-content">
          <div className="app-icon-container">
            <Download size={24} color="white" />
          </div>
          <div className="text-container">
            <h3>Get the App</h3>
            <p>Install Lost & Found on your home screen for a better experience.</p>
          </div>
          <button className="install-btn" onClick={handleInstall}>
            Install
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .install-prompt-overlay {
          position: fixed;
          bottom: 80px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          padding: 0 16px;
          z-index: 1000;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .install-prompt-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          padding: 20px;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .prompt-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .app-icon-container {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .text-container {
          flex-grow: 1;
        }

        .text-container h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
        }

        .text-container p {
          margin: 4px 0 0;
          font-size: 0.85rem;
          color: #4b5563;
          line-height: 1.4;
        }

        .install-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          white-space: nowrap;
        }

        .install-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }

        .install-btn:active {
          transform: translateY(0);
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
};

export default InstallPrompt;
