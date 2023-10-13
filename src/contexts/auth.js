import { createContext, useState, useEffect } from "react";
import { api } from '../api';
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      return jwt_decode(token);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return null;
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const response = await api.post("/auth/login", {
        email: email,
        senha: password,
      });

      if (response.data.message) {
        return { message: response.data.message };
      } else {
        setUser(response.data.user);

        localStorage.setItem("@Auth:user", JSON.stringify(response.data.user));
        localStorage.setItem("@Auth:accessToken", response.data.token);
        localStorage.setItem("@Auth:refreshToken", response.data.refreshToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

        navigate("/home");
      }
    } catch (error) {
      return { message: "Erro ao fazer login. Por favor, tente novamente mais tarde." };
    }
  };

  const checkTokenExpiration = async () => {
    const accessToken = localStorage.getItem("@Auth:accessToken");
    const refreshToken = localStorage.getItem("@Auth:refreshToken");
  
    if (!accessToken || !refreshToken) {
      return;
    }
  
    const accessTokenExpiration = decodeToken(accessToken).exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationThreshold = 5 * 60; // 5 minutos
  
    if (accessTokenExpiration - currentTimestamp <= expirationThreshold) {
      try {

        const response = await api.post("/auth/refresh", {
          refreshToken: refreshToken,
        });
  
        if (response.data.accessToken) {

          localStorage.setItem("@Auth:accessToken", response.data.accessToken);
  
          api.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
        }
      } catch (error) {
        console.error("Erro ao atualizar o accessToken:", error);
      }
    }
  };

  useEffect(() => {
    const loadingStoreData = () => {
      const storageUser = localStorage.getItem("@Auth:user");
      const storageToken = localStorage.getItem("@Auth:accessToken");

      if (storageUser && storageToken) {
        setUser(JSON.parse(storageUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${storageToken}`;
      }
    };
    loadingStoreData();

    checkTokenExpiration();
  }, []);

  const signUp = async ({ nome, email, senha, confirmarSenha }) => {
    try {
      const response = await api.post("/cadastro", {
        nome,
        email,
        senha,
        confirmarSenha,
      });

      if (response.data.message) {
        return { message: response.data.message };
      } else {
        setUser(response.data.user);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

        localStorage.setItem("@Auth:user", JSON.stringify(response.data.user));
        localStorage.setItem("@Auth:accessToken", response.data.token);

        navigate("/login");
      }
    } catch (error) {
      return { message: "Erro ao fazer cadastro. Por favor, tente novamente mais tarde." };
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
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        signed: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
