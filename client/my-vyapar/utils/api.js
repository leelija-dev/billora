const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const fullUrl = `${BASE_URL}${endpoint}`;
    
    // Get token from localStorage or wherever you store it
    const token = localStorage.getItem('token'); // or sessionStorage, depending on your auth system
    
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};