import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/auth";
import { useForm } from "react-hook-form";
import { Navigate, Link } from "react-router-dom";
import Button from "./Button";

const LoginForm = () => {
  const { signIn, signed } = useContext(AuthContext);
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
      const response = await signIn(data);
      if (response.message) {
        setErrorMessages({ general: response.message });
      }
    } catch (error) {
      setErrorMessages({ general: "Erro ao fazer login. Por favor, tente novamente mais tarde." });
    }
  };

  if (signed) {
    return <Navigate to="/home" />;
  }

  return (
    <motion.section
      className="register"
      initial={{ width: 0 }}
      animate={{ width: "100%", transition: { duration: 0.5 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
    >
      <img src="logo-blue.svg" alt="" />
      <p>Já tem conta? Faça seu login:</p>
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

<Link to="/esqueci-senha" className="register__forgot">
  Esqueci minha senha
</Link>
        {errorMessages.general && <p className="error">{errorMessages.general}</p>}
        <Button type="submit" children="Entrar" />
        <p>Ainda não tem conta?</p>
        <Link to="/cadastro" className="register__newUser">
          Faça seu cadastro
        </Link>
      </form>
    </motion.section>
  );
};

export default LoginForm;
