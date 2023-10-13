import { createContext, useState, useEffect } from "react";
import { api } from '../api';
import { useNavigate } from "react-router-dom";

export const AuthContextAbrigos = createContext();

export const AuthProviderAbrigos = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStoredData = () => {
      const storageUser = localStorage.getItem("@AuthAbrigo:user");
      const storageToken = localStorage.getItem("@AuthAbrigo:token");

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storageToken}`;
      }
    };
    loadStoredData();
  }, []);

  const signInAbrigo = async ({ email, password }) => {
    try {
      const response = await api.post("/login/abrigo", {
        email: email,
        senha: password,
      });

      if (response.data.message) {
        return { message: response.data.message };
      } else {
        setUser(response.data.user);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

        localStorage.setItem("@AuthAbrigo:user", JSON.stringify(response.data.user));
        localStorage.setItem("@AuthAbrigo:token", response.data.token);

        navigate("/dashboard/abrigo");
      }
    } catch (error) {
      return { message: "Erro ao fazer login. Por favor, tente novamente mais tarde." };
    }
  };

  const signOut = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.clear();

      setUser(null);

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContextAbrigos.Provider
      value={{
        user,
        signInAbrigo,
        signOut,
        signedAbrigo: !!user,
      }}
    >
      {children}
    </AuthContextAbrigos.Provider>
  );
};
