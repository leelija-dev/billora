// authstore.js - Enhanced version
export const saveAuthData = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
};

export const getAuthData = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  // Optional: Clear any other auth-related data
  sessionStorage.removeItem("auth_expiry");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  // Optional: Check token expiry
  if (!token) return false;
  
  // If you store expiry time
  const expiry = localStorage.getItem("token_expiry");
  if (expiry && Date.now() > parseInt(expiry)) {
    clearAuthData();
    return false;
  }
  
  return true;
};

// Optional: Add token expiry tracking
export const setTokenWithExpiry = (token, expiresInMinutes = 60) => {
  const expiryTime = Date.now() + (expiresInMinutes * 60 * 1000);
  localStorage.setItem("token", token);
  localStorage.setItem("token_expiry", expiryTime.toString());
};