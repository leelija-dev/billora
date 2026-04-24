// utils/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
import { logger } from './logger';

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
        "Accept": "application/json"
      },
      credentials: 'include' // Include cookies for authentication
    };
    
    if (body) {
      options.body = JSON.stringify(body);
      logger.log("Stringified body:", options.body);
    }
    
    const res = await fetch(fullUrl, options);
    const data = await res.json();
    
    logger.log("📥 RESPONSE:", data);
    logger.log("=" .repeat(50));
    
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    
    return data;
  } catch (error) {
    logger.error("API Error:", error);
    throw error;
  }
};