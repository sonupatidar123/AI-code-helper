import React, { useState } from 'react';
import { Star, Copy, MapPin, Phone, Check } from 'lucide-react';
import './ReviewFunnel.css'; // Import the CSS file

const BRAND_NAME = import.meta.env.VITE_BRAND_NAME;
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER;
const SUGGESTED_REVIEWS = [
  "Had a great experience with A. K. Consultancies & Constructions in Indore. Their architectural design ideas are modern, practical, and perfectly suited to client requirements. Highly recommended for residential and commercial projects.",
  "One of the best architecture firms in Indore. The team provided excellent building planning and 3D visualization services for our dream home. Very professional approach and timely support.",
  "A. K. Consultancies & Constructions did an amazing job on our interior design project. The team understood our vision and transformed the space beautifully. Excellent work quality and creativity.",
  "Very satisfied with their turnkey project services. From planning to execution, everything was handled smoothly and professionally. Great construction consultants in Indore.",
  "We hired A. K. Consultancies & Constructions for residential design and interior work. Their attention to detail and innovative ideas made a huge difference. Truly reliable professionals.",
  "Highly professional architectural designer in Indore. Their 3D visualization helped us understand the complete project before construction started. Great experience overall.",
  "Excellent architecture and construction consultancy services. The team is knowledgeable, responsive, and committed to quality work. Strongly recommended for modern home designs.",
  "A. K. Consultancies & Constructions provided outstanding commercial design services for our office. The final result was modern, functional, and visually impressive.",
  "Very impressed with their building planning and execution process. The project was completed on time with great finishing and quality materials.",
  "One of the most trusted construction consultants in Indore. Their team guided us properly throughout the entire project and delivered exactly what they promised.",
  "Amazing experience working with A. K. Consultancies & Constructions. Their interior design concepts are stylish, elegant, and budget-friendly. Highly satisfied with the outcome.",
  "Professional and creative architecture firm in Indore. They offered smart space planning solutions and excellent customer support during the entire project.",
  "The team is highly experienced in residential and commercial design. Their innovative architectural concepts and practical execution make them stand out.",
  "Great service and professional behavior. The 3D design visualization was realistic and helped us finalize every detail before starting construction.",
  "We approached A. K. Consultancies & Constructions for a turnkey residential project, and the experience was fantastic. Quality construction and timely delivery impressed us a lot.",
  "Best architectural and interior design services in Indore. The team listens carefully to client needs and delivers customized solutions with perfection.",
  "Their commercial project planning and interior execution exceeded our expectations. Very professional company with skilled architects and designers.",
  "A. K. Consultancies & Constructions is the perfect choice for anyone looking for modern architecture, interior design, and construction consultancy services in Indore.",
  "The team delivered excellent residential design services with beautiful elevation concepts and smart interior planning. Highly recommend their work.",
  "Truly professional construction consultants and architectural designers. They maintain quality, transparency, and customer satisfaction throughout the entire project journey."
];

const ReviewFunnel = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [step, setStep] = useState('initial'); 
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedback, setFeedback] = useState({ name: '', text: '' });
  const [status, setStatus] = useState('idle');

  const GOOGLE_MAPS_LINK = import.meta.env.VITE_GOOGLE_MAPS_LINK || 'https://g.page/r/Ca3l0aWZ3iyhEBM/review';

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
    if (selectedRating >= 4) {
      setStep('google');
    } else {
      setStep('internal');
    }
  };

  const openGoogleReview = () => {
    window.open(GOOGLE_MAPS_LINK, '_blank');
    setSelectedReviewIndex(null);
    setCopiedIndex(null);
  };

  const handleCopyAndNext = async (review, index) => {
    if (copiedIndex === index) {
      openGoogleReview();
    } else {
      try {
        await navigator.clipboard.writeText(review);
        setCopiedIndex(index);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate a brief network delay, then always show success
    setTimeout(() => {
      setStatus('success');
    }, 600);
  };

  return (
    <div className="funnel-container">
      <header className="funnel-header">
        <h1 className="brand-name">{BRAND_NAME}</h1>
        <div className="header-info">
          <p className="info-item"><MapPin size={14} /> Indore</p>
          <p className="info-item"><Phone size={14} /> {PHONE_NUMBER}</p>
        </div>
      </header>

      <main className="funnel-main">
        <div className="google-intro">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
            alt="Google" 
            className="google-logo"
          />
          <h2 className="instruction-text">How was your experience?</h2>
        </div>

        <div className="stars-wrapper">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRatingClick(star)}
              className="star-button"
            >
              <Star
                size={44}
                fill={(hover || rating) >= star ? "#FBBC05" : "none"}
                stroke={(hover || rating) >= star ? "#FBBC05" : "#D1D5DB"}
              />
            </button>
          ))}
        </div>

        {step === 'internal' && (
          <div className="feedback-card">
            {status === 'success' ? (
              <div className="status-message">
                <p className="success-text">Thank you for your feedback!</p>
                <p className="sub-text">We appreciate your honesty and will work on improving.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="feedback-form">
                <input 
                  className="form-input"
                  type="text" required placeholder="Name" 
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                />
                <textarea 
                  className="form-textarea"
                  rows="4" required placeholder="Your Feedback" 
                  value={feedback.text}
                  onChange={(e) => setFeedback({ ...feedback, text: e.target.value })}
                ></textarea>
                {status === 'error' && <p className="error-msg">Failed to submit feedback.</p>}
                <button type="submit" disabled={status === 'loading'} className="submit-btn">
                  {status === 'loading' ? 'SUBMITTING...' : 'SUBMIT FEEDBACK'}
                </button>
              </form>
            )}
          </div>
        )}

        {step === 'google' && (
          <div className="google-step">
            <div className="thanks-banner">
              <p className="success-text">Thank you for the {rating} stars!</p>
              <p className="sub-text">Select a review to copy and post on Google.</p>
            </div>

            <div className="reviews-list">
              {SUGGESTED_REVIEWS.map((review, index) => (
                <div key={index} className="review-item-container">
                  <button
                    onClick={() => setSelectedReviewIndex(selectedReviewIndex === index ? null : index)}
                    className={`review-card ${selectedReviewIndex === index ? 'selected' : ''}`}
                  >
                    <p className="review-text">"{review}"</p>
                  </button>

                  {selectedReviewIndex === index && (
                    <div className="action-area">
                      <button
                        onClick={() => handleCopyAndNext(review, index)}
                        className={`action-btn ${copiedIndex === index ? 'btn-success' : 'btn-primary'}`}
                      >
                        {copiedIndex === index ? (
                          <><Check size={18} /> Copied! Click Next →</>
                        ) : (
                          <><Copy size={18} /> Copy & Next</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="funnel-footer">
        <p>© {new Date().getFullYear()} A. K. CONSULTANCIES & CONSTRUCTIONS</p>
      </footer>
    </div>
  );
};

export default ReviewFunnel;
