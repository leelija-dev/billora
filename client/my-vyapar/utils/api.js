// utils/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const token = localStorage.getItem("token");
    const fullUrl = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    console.log("=" .repeat(50));
    console.log("📤 API REQUEST");
    console.log("URL:", fullUrl);
    console.log("Method:", method);
    console.log("Body being stringified:", body);
    
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", 
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
      console.log("Stringified body:", options.body);
    }
    
    const res = await fetch(fullUrl, options);
    const data = await res.json();
    
    console.log("📥 RESPONSE:", data);
    console.log("=" .repeat(50));
    
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};