// utils/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
import { logger } from './logger';

// Helper function to get CSRF token from cookies
const getCsrfToken = () => {
  if (typeof document === 'undefined') return null;
  
  // Try multiple cookie names that Laravel might use
  const cookieNames = ['XSRF-TOKEN', 'csrf_token', 'laravel_session'];
  
  for (const name of cookieNames) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const token = parts.pop().split(';').shift();
      if (token) {
        logger.log(`🔐 Found ${name} cookie`);
        // Decode URI-encoded token
        return decodeURIComponent(token);
      }
    }
  }
  
  return null;
};

// Pre-fetch CSRF token on page load
let csrfTokenPromise = null;

const ensureCsrfToken = async () => {
  if (csrfTokenPromise) return csrfTokenPromise;
  
  csrfTokenPromise = (async () => {
    try {
      logger.log("🔄 Pre-fetching CSRF token...");
      const response = await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.ok) {
        logger.log("✅ CSRF cookie fetched successfully");
        // Wait a bit for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        return getCsrfToken();
      } else {
        logger.warn("⚠️ CSRF cookie fetch failed:", response.status);
        return null;
      }
    } catch (error) {
      logger.error("❌ Failed to fetch CSRF cookie:", error);
      return null;
    }
  })();
  
  return csrfTokenPromise;
};

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const fullUrl = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    logger.log("=" .repeat(50));
    logger.log("📤 API REQUEST");
    logger.log("URL:", fullUrl);
    logger.log("Method:", method);
    logger.log("Body being stringified:", body);
    
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: 'include' // Include cookies for authentication
    };
    
    // For POST, PUT, PATCH, DELETE requests, ensure CSRF token
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      await ensureCsrfToken();
      
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        options.headers['X-XSRF-TOKEN'] = csrfToken;
        logger.log("🔐 CSRF token added to headers:", csrfToken.substring(0, 20) + "...");
      } else {
        logger.warn("⚠️ No CSRF token found in cookies");
        logger.log("🍪 Available cookies:", document.cookie);
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body);
      logger.log("Stringified body:", options.body);
    }
    
    logger.log("📋 Request headers:", options.headers);
    
    const res = await fetch(fullUrl, options);
    const data = await res.json();
    
    logger.log("📥 RESPONSE STATUS:", res.status);
    logger.log("📥 RESPONSE:", data);
    logger.log("=" .repeat(50));
    
    // Handle specific error cases
    if (res.status === 419) {
      // Reset CSRF token promise on mismatch
      csrfTokenPromise = null;
      throw new Error("CSRF token mismatch. Please refresh the page and try again.");
    }
    
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    
    return data;
  } catch (error) {
    logger.error("API Error:", error);
    throw error;
  }
};

// Initialize CSRF token on page load
if (typeof window !== 'undefined') {
  ensureCsrfToken();
}