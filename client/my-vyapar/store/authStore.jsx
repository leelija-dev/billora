export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user"));
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};