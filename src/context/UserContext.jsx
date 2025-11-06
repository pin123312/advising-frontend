import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [user, token]);

   useEffect(() => {
    const refreshUser = async () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          const { data } = await axios.get(
            `http://localhost:8000/api/users/${parsedUser.id}`,
            { headers: { Authorization: `Bearer ${savedToken}` } }
          );
          setUser(data);
          setToken(savedToken);
          console.log("User refreshed:", data);
        } catch (error) {
          console.error("Failed to refresh user:", error);
          setUser(null);
          setToken(null);
          localStorage.clear();
        }
      }
    };

    refreshUser();
  }, []); 
  
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://localhost:8000/api/logout",
          {},
          {
            headers: {
            Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
  }
};

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};
