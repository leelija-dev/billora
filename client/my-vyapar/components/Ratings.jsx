"use client";

import { useState, useEffect } from "react";

const Ratings = () => {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [voteCount, setVoteCount] = useState(31821);
  const [hasVoted, setHasVoted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Mouse position state for parallax effect (global)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Track mouse movement globally
    const handleMouseMove = (e) => {
      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate normalized mouse position (-1 to 1) relative to window center
      const normalizedX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
      const normalizedY = (e.clientY - windowHeight / 2) / (windowHeight / 2);
      
      setMousePosition({ x: normalizedX, y: normalizedY });
    };

    // Add global mouse move listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleRatingClick = (selectedRating) => {
    if (!hasVoted) {
      setRating(selectedRating);
      setVoteCount(voteCount + 1);
      setHasVoted(true);
      setShowThankYou(true);
      
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (!hasVoted) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const averageRating = ((rating * (voteCount - 1) + rating) / voteCount).toFixed(2);

  // Individual movement for each element with different intensities
  const getElementStyle = (index, intensity = 30, reverseX = false, reverseY = false) => {
    const xFactor = reverseX ? -1 : 1;
    const yFactor = reverseY ? -1 : 1;
    return {
      transform: `translate(${mousePosition.x * intensity * xFactor}px, ${mousePosition.y * intensity * yFactor}px)`,
      transition: 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1)'
    };
  };

  return (
    <section id="ratings-section" className="py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-center relative overflow-hidden min-h-[400px]">
      
      <style>{`
        @keyframes gentle-float {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.7; }
        }
        .gentle-pulse {
          animation: gentle-float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Billing Instrument Elements - Move with global cursor */}
      
      
      <div 
        className="absolute top-40 right-20 text-6xl opacity-60 gentle-pulse pointer-events-none"
        style={{ ...getElementStyle(1, 45, true, false), opacity: 0.6 }}
      >💰</div>
      
      
      
      
      
     
      
      
      
      {/* Additional elements */}
      <div 
        className="absolute top-10 right-1/4 text-5xl opacity-50 gentle-pulse pointer-events-none"
        style={getElementStyle(7, 55, true, false)}
      >📦</div>
      
      <div 
        className="absolute bottom-40 left-20 text-6xl opacity-50 gentle-pulse pointer-events-none"
        style={getElementStyle(8, 45, false, false)}
      >🏷️</div>
      
      
      
      <div 
        className="absolute bottom-10 left-10 text-5xl opacity-60 gentle-pulse pointer-events-none"
        style={getElementStyle(10, 50, true, false)}
      >✉️</div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      
      {/* Floating particles - move with cursor too */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-400/40 rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              ...getElementStyle(i + 20, 30 + Math.random() * 30, Math.random() > 0.5, Math.random() > 0.5),
              opacity: 0.3 + Math.random() * 0.3
            }}
          />
        ))}
      </div>

      {/* Content Container - slight movement on main content too */}
      <div 
        className="relative z-10 max-w-4xl mx-auto px-4"
        style={getElementStyle(100, 8, false, false)}
      >
        <h2 className="text-[32px] font-bold text-[#0f172a] mb-[30px] leading-[1.3] max-md:text-2xl max-sm:text-xl relative inline-block after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-[80px] after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-full">
          How useful is Vyapar for Your Business?
        </h2>
        
        <div className="flex justify-center gap-6 mb-6 max-sm:gap-3">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`text-[50px] inline-block transition-all duration-300 max-md:text-[40px] max-sm:text-[35px] ${
                (hoverRating || rating) >= starValue 
                  ? "text-[#fbbf24] [text-shadow:0_0_20px_rgba(251,191,36,0.5)] scale-110" 
                  : "text-[#cbd5e1] hover:text-[#fcd34d]"
              } ${hasVoted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-125 hover:rotate-3"}`}
              onClick={() => handleRatingClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              role="button"
              tabIndex={hasVoted ? -1 : 0}
              aria-label={`Rate ${starValue} out of 5 stars`}
            >
              ★
            </span>
          ))}
        </div>

        <div className="flex justify-center gap-[40px] mb-5 text-base max-md:flex-col max-md:gap-3 max-sm:text-sm">
          <p className="text-[#334155] font-semibold bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm">
            ⭐ Average rating {averageRating}/5
          </p>
          <p className="text-[#64748b] bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm">
            👥 Vote count: {voteCount.toLocaleString()}
          </p>
        </div>

        {showThankYou && (
          <p className="text-[#10b981] font-semibold py-3 bg-[#d1fae5] rounded-[40px] max-w-[350px] mx-auto shadow-lg animate-bounce">
            Thank you for rating this post! 🎉
          </p>
        )}
        
        {hasVoted && !showThankYou && (
          <p className="text-[#3b82f6] font-medium py-3 bg-[#dbeafe] rounded-[40px] max-w-[350px] mx-auto shadow-md">
            You rated this {rating} out of 5 stars ✨
          </p>
        )}
      </div>
    </section>
  );
};

export default Ratings;



