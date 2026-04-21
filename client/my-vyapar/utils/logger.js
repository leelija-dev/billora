/**
 * Logger utility - Conditional console logging based on environment
 * Shows logs in development mode, hides in production
 */


const isDevelopment = process.env.NEXT_PUBLIC_PROJECT_MODE === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  // For backward compatibility, you can also use these methods
  blue: (...args) => {
    if (isDevelopment) {
      console.log('BLUE:', ...args);
    }
  },
  
  green: (...args) => {
    if (isDevelopment) {
      console.log('GREEN:', ...args);
    }
  },
  
  red: (...args) => {
    if (isDevelopment) {
      console.log('RED:', ...args);
    }
  }
};

export default logger;
