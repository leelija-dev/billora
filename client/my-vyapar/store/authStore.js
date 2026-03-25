// Save user data to localStorage
export const saveAuthData = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
};

// Get user data from localStorage
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

// Clear user data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};