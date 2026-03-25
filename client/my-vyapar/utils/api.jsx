const BASE_URL = "http://localhost:8000/api";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method, 
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,NPM 
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    throw error;
  }
};