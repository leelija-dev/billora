"use client";

import React, { useState } from "react";

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
    <section className="py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-center">
      <div className="max-w-[800px] mx-auto p-10 bg-white rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#e2e8f0] max-md:p-8 max-sm:p-6">
        <h2 className="text-[28px] font-bold text-[#0f172a] mb-[30px] leading-[1.3] max-md:text-2xl max-sm:text-xl">
          How useful is Vyapar for Your Business?
        </h2>
        
        <div className="flex justify-center gap-4 mb-6 max-sm:gap-2">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <span
              key={starValue}
              className={`text-[40px] inline-block transition-all duration-200 max-md:text-[35px] max-sm:text-[30px] ${
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

        <div className="flex justify-center gap-[30px] mb-5 text-base max-md:flex-col max-md:gap-2.5 max-sm:text-sm">
          <p className="text-[#334155] font-semibold">
            Average rating {averageRating}/5
          </p>
          <p className="text-[#64748b]">
            Vote count: {voteCount.toLocaleString()}
          </p>
        </div>

        {showThankYou && (
          <p className="text-[#10b981] font-semibold py-2.5 bg-[#d1fae5] rounded-[30px] max-w-[300px] mx-auto opacity-100 transition-opacity duration-300">
            Thank you for rating this post!
          </p>
        )}
        
        {hasVoted && !showThankYou && (
          <p className="text-[#3b82f6] font-medium py-2.5 bg-[#dbeafe] rounded-[30px] max-w-[300px] mx-auto">
            You rated this {rating} out of 5 stars
          </p>
        )}
      </div>
    </section>
  );
};

export default Ratings;