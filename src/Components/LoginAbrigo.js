import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { AuthContextAbrigos } from "../contexts/AuthContextAbrigos";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import Button from "./Button";

const LoginAbrigo = () => {
  const { signInAbrigo, signedAbrigo } = useContext(AuthContextAbrigos);
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const [errorMessages, setErrorMessages] = useState({});

  const changeType = (id) => {
    const element = document.querySelector(id);
    if (element.type === "senha") {
      element.setAttribute("type", "text");
    } else {
      element.setAttribute("type", "senha");
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await signInAbrigo(data);
      if (response.message) {
        setErrorMessages({ general: response.message });
      }
    } catch (error) {
      setErrorMessages({ general: "Erro ao fazer login. Por favor, tente novamente mais tarde." });
    }
  };

  if (signedAbrigo) {
    return <Navigate to="/dashboard/abrigo" />;
  }

  return (
    <motion.section
      className="register"
      initial={{ width: 0 }}
      animate={{ width: "100%", transition: { duration: 0.5 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
    >
      <img src="logo-blue.svg" alt="" />
      <p>Área restrita: Abrigos</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "É necessário informar um endereço de email",
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          placeholder="Insira seu email"
        />
        {errors.email && (
          <p className="error">
            {errors.email.message || "Por favor, verifique o email digitado"}
          </p>
        )}

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Insira sua senha",
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
          })}
          placeholder="Insira sua senha"
        />
        {errors.password && (
          <p className="error">
            {errors.password.message ||
              "A senha deve conter pelo menos uma letra maiúscula, um número e ter entre 6 e 15 caracteres"}
          </p>
        )}

        <a className="register__forgot" href="#">
          Esqueci minha senha
        </a>
        {errorMessages.general && <p className="error">{errorMessages.general}</p>}
        <Button type="submit" children="Entrar" />
      </form>
    </motion.section>
  );
};

export default LoginAbrigo;
