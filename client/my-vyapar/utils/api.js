// utils/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const token = localStorage.getItem("token");

    const fullUrl = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    console.log("Full API URL:", fullUrl);
    console.log("Token:", token);

    const res = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Something went wrong");

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};