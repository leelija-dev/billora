// components/Container.jsx
import React from 'react';

const Container = ({ 
  children, 
  className = '',
  maxWidth = 'max-w-[1300px]',
  padding = 'px-4 sm:px-6 md:px-8',
  fluid = false
}) => {
  return (
    <div className={`
      w-full mx-auto
      ${!fluid ? maxWidth : 'max-w-full'}
      ${padding}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Container;