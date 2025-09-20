import { createContext, useContext, useState, useEffect } from "react";

// Default values
const defaultAuth = {
  isLogged: false,
  id: null,
  role: null,
  name: null,
  email: null,
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(defaultAuth);

  // Store login data in localStorage
  const storeAuthData = (data) => {
    localStorage.setItem("authData", JSON.stringify(data));
    setAuth({ ...data, isLogged: true });
  };

  // Fetch login data from localStorage
  const fetchAuthData = () => {
    const stored = localStorage.getItem("authData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth({ ...parsed, isLogged: true });
    }
  };

  // Clear localStorage and reset
  const clearAuthData = () => {
    localStorage.removeItem("authData");
    setAuth(defaultAuth);
  };

  // On mount, load auth if available
  useEffect(() => {
    fetchAuthData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, storeAuthData, fetchAuthData, clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
