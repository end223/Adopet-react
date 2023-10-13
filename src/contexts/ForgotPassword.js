import React, { useState } from "react";
import { api } from "../api"; // Importe a instância do axios
import Button from "../Components/Button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errorMessages, setErrorMessages] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/esqueceu-senha", { email });
      setMessage(response.data.message);

      if (response.data.error) {
        setErrorMessages({ general: response.data.error });
      }
    } catch (error) {
      setMessage("Erro ao solicitar redefinição de senha.");
    }
  };

  return (
    <motion.div
      className="register"
      initial={{ width: 0 }}
      animate={{ width: "100%", transition: { duration: 0.5 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
    >
      <h1>Esqueci minha senha</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Insira seu email"
        />
        {errorMessages.general && <p className="error">{errorMessages.general}</p>}
        <Button type="submit" children="Enviar solicitação" />
        <p>{message}</p>
      </form>
      <Link to="/login" className="register__login">
        Voltar para o login
      </Link>
    </motion.div>
  );
};

export default ForgotPassword;
