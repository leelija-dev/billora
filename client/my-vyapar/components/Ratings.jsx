"use client";

import { useState } from "react";

const Ratings = () => {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [voteCount, setVoteCount] = useState(31821);
  const [hasVoted, setHasVoted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

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

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-center relative overflow-hidden">
      
      {/* Animated Billing Instruments Background */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.15; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 0.25; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(20px) rotate(-5deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        .bill-float-1 { animation: float 6s ease-in-out infinite; }
        .bill-float-2 { animation: float 8s ease-in-out infinite 1s; }
        .bill-float-3 { animation: float 7s ease-in-out infinite 2s; }
        .bill-sway { animation: sway 5s ease-in-out infinite; }
        .bill-pulse { animation: pulse-scale 4s ease-in-out infinite; }
        
        @media (max-width: 640px) {
          .bill-element { font-size: 1.5rem !important; opacity: 0.08 !important; }
        }
      `}</style>

      {/* Billing Instrument Elements - Responsive */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 text-3xl sm:text-5xl md:text-6xl bill-float-1 opacity-15 sm:opacity-15">📄</div>
      <div className="absolute top-32 sm:top-40 right-5 sm:right-20 text-2xl sm:text-4xl md:text-5xl bill-float-2 bill-sway opacity-12 sm:opacity-15">💰</div>
      <div className="absolute bottom-24 sm:bottom-32 left-1/4 text-3xl sm:text-5xl md:text-7xl bill-float-3 opacity-12 sm:opacity-15">📊</div>
      <div className="absolute top-1/2 right-1/4 text-2xl sm:text-4xl md:text-6xl bill-float-1 bill-sway opacity-12 sm:opacity-15">💳</div>
      <div className="absolute bottom-16 sm:bottom-20 right-5 sm:right-10 text-2xl sm:text-4xl md:text-5xl bill-float-2 opacity-12 sm:opacity-15">📋</div>
      <div className="absolute top-1/3 left-1/3 text-3xl sm:text-5xl md:text-6xl bill-pulse opacity-10 sm:opacity-12">🧾</div>
      <div className="absolute bottom-1/3 right-1/3 text-2xl sm:text-4xl md:text-5xl bill-float-3 bill-sway opacity-10 sm:opacity-12">💹</div>

      {/* Content Container */}
      <div className="relative z-10 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl md:text-[28px] font-bold text-[#0f172a] mb-6 sm:mb-8 lg:mb-[30px] leading-tight">
          How useful is Vyapar for<br className="sm:hidden" /> Your Business?
        </h2>
        
        {/* Stars Rating */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-[40px] inline-block transition-all duration-200 ${
                (hoverRating || rating) >= starValue ? "text-[#fbbf24] [text-shadow:0_0_10px_rgba(251,191,36,0.3)]" : "text-[#cbd5e1]"
              } ${hasVoted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-110 hover:text-[#fbbf24]"}`}
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

        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-6 md:gap-[30px] mb-6 sm:mb-8 text-sm sm:text-base">
          <p className="text-[#334155] font-semibold">
            Average rating {averageRating}/5
          </p>
          <p className="text-[#64748b] text-sm sm:text-base">
            Vote count: {voteCount.toLocaleString()}
          </p>
        </div>

        {/* Thank You Message */}
        {showThankYou && (
          <p className="text-[#10b981] font-semibold py-2 sm:py-2.5 px-4 bg-[#d1fae5] rounded-full max-w-xs sm:max-w-sm mx-auto opacity-100 transition-opacity duration-300 text-xs sm:text-sm md:text-base">
            Thank you for rating this post!
          </p>
        )}
        
        {/* Vote Confirmation Message */}
        {hasVoted && !showThankYou && (
          <p className="text-[#3b82f6] font-medium py-2 sm:py-2.5 px-4 bg-[#dbeafe] rounded-full max-w-xs sm:max-w-sm mx-auto text-xs sm:text-sm md:text-base">
            You rated this {rating} out of 5 stars
          </p>
        )}
      </div>
    </section>
  );
};

export default Ratings;
