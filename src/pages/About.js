import React, { useState, useEffect } from 'react';
import { aboutAPI } from '../services/api';
import './About.css';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    console.log('ℹ️ About component mounted');
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      console.log('ℹ️ Starting to fetch about data...');
      setLoading(true);
      const data = await aboutAPI.getAboutData();
      
      console.log('ℹ️ About data received:', data);
      setAboutData(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error in fetchAboutData:', err);
      setError('Failed to load about page data. Please try again later.');
    } finally {
      console.log('ℹ️ Finished loading about data');
      setLoading(false);
    }
  };

  const getContactIcon = (type) => {
    const iconMap = {
      mobile: '📱',
      phone: '📞',
      email: '📧',
      instagram: '📷',
      facebook: '📘',
      twitter: '🐦',
      linkedin: '💼',
      youtube: '📺',
      whatsapp: '💬',
      website: '🌐',
      address: '📍',
      location: '🗺️'
    };
    return iconMap[type.toLowerCase()] || '📋';
  };

  const getContactLabel = (type) => {
    const labelMap = {
      mobile: 'Mobile',
      phone: 'Phone',
      email: 'Email',
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      youtube: 'YouTube',
      whatsapp: 'WhatsApp',
      website: 'Website',
      address: 'Address',
      location: 'Location'
    };
    return labelMap[type.toLowerCase()] || type;
  };

  const formatDescription = (description) => {
    return description.split('\n\n').map((paragraph, index) => (
      <p key={index} className="description-paragraph">
        {paragraph}
      </p>
    ));
  };

  const copyToClipboard = async (text, type) => {
    try {
      console.log('📋 Copying to clipboard:', { text, type });
      await navigator.clipboard.writeText(text);
      console.log('✅ Successfully copied to clipboard');
      
      // Show success message
      setCopyMessage(`${getContactLabel(type)} number copied!`);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setCopyMessage('');
      }, 3000);
    } catch (err) {
      console.error('❌ Failed to copy to clipboard:', err);
      setCopyMessage('Failed to copy number');
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setCopyMessage('');
      }, 3000);
    }
  };

  const handleContactClick = (type, value) => {
    // Only copy to clipboard for mobile/phone numbers
    if (type.toLowerCase() === 'mobile' || type.toLowerCase() === 'phone') {
      copyToClipboard(value, type);
    }
  };

  if (loading) {
    console.log('ℹ️ Rendering loading state');
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading about page...</p>
      </div>
    );
  }

  if (error) {
    console.log('ℹ️ Rendering error state:', error);
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchAboutData} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  console.log('ℹ️ Rendering about page with data:', aboutData);
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About MN-SHOP</h1>
          <p>Your trusted destination for quality products</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          {/* Company Description */}
          {aboutData?.description && (
            <div className="about-section">
              <h2>Our Story</h2>
              <div className="description-content">
                {formatDescription(aboutData.description)}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {aboutData?.contactInfo && Object.keys(aboutData.contactInfo).length > 0 && (
            <div className="about-section">
              <h2>Get In Touch</h2>
              <div className="contact-grid">
                {Object.entries(aboutData.contactInfo).map(([type, value]) => (
                  <div 
                    key={type} 
                    className={`contact-item ${(type.toLowerCase() === 'mobile' || type.toLowerCase() === 'phone') ? 'clickable' : ''}`}
                    onClick={() => handleContactClick(type, value)}
                  >
                    <div className="contact-icon">
                      {getContactIcon(type)}
                    </div>
                    <div className="contact-details">
                      <h3>{getContactLabel(type)}</h3>
                      <p>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Copy Success Message */}
          {copyMessage && (
            <div className="copy-message">
              <span className="copy-icon">✅</span>
              <span>{copyMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
