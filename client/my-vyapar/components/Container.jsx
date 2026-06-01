// components/Container.jsx
import React from 'react';
// min-h-[60vh]
const Container = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`
      w-full mx-auto
      container          /* Match navbar's max-w */
      px-4 sm:px-5    /* Match navbar's padding */
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Container;