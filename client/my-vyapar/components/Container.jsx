// components/Container.jsx
import React from 'react';

const Container = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`
      w-full mx-auto
      max-w-[1400px]           /* Match navbar's max-w */
      px-4 sm:px-5 lg:px-10    /* Match navbar's padding */
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Container;