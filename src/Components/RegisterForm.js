import Button from "./Button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp, signed } = useContext(AuthContext);

  const [visiblePassword, setVisiblePassword] = useState({
    password: false,
    passwordRetry: false,
  });

  const handlePasswordType = (passwordInput) => {
    setVisiblePassword({
      ...visiblePassword,
      [passwordInput]: visiblePassword[passwordInput] ? false : true,
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const [errorMessages, setErrorMessages] = useState({}); 

  const onSubmit = async (data) => {
    try {
      const response = await signUp(data);
      if (response.message) {
        setErrorMessages({ general: response.message });
      }
    } catch (error) {
      setErrorMessages({ general: "Erro ao fazer cadastro. Por favor, tente novamente mais tarde." });
    }
  };

  if (signed) {
    return <Navigate to="/home" />;
  }

  return (
    <motion.section
      className="register"
      initial={{ width: 0 }}
      animate={{ width: "auto", transition: { duration: 0.5 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
    >
      <img src="logo-blue.svg" alt="" />
      <p>
        Ainda não tem cadastro? <br /> Então, antes de buscar seu melhor amigo,
        precisamos de alguns dados:
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          {...register("nome", {
            required: "É necessário informar seu nome",
            maxLength: {
              value: 25,
              message: "O número máximo de caracteres é 25",
            },
          })}
          placeholder="Digite seu nome completo"
        />
        {errors.nome && <p className="error">{errors.nome.message}</p>}

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "É necessário informar um endereço de email",
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          placeholder="Escolha seu melhor email"
        />
        {errors.email && (
          <p className="error">
            {errors.email.message || "Por favor, verifique o email digitado"}
          </p>
        )}

        <label htmlFor="pass-create">Senha</label>
        <span>
          <span
            onClick={() => handlePasswordType("password")}
            className="pass__view"
          ></span>
          <input
            id="pass-create"
            type={visiblePassword.password ? "text" : "password"}
            {...register("senha", {
              required: "Crie uma senha",
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
            })}
            placeholder="Crie uma senha"
          />
        </span>
        {errors.senha && (
          <p className="error">
            {errors.senha.message ||
              "A senha deve conter pelo menos uma letra maiúscula, um número e ter entre 6 e 15 caracteres"}
          </p>
        )}

        <label htmlFor="pass-confirm">Confirme sua senha</label>
        <span>
          <span
            onClick={() => handlePasswordType("passwordRetry")}
            className="pass__view"
          ></span>
          <input
            id="pass-confirm"
            type={visiblePassword.passwordRetry ? "text" : "password"}
            {...register("confirmarSenha", {
              required: "Repita a senha criada acima",
              validate: (value) => {
                if (watch("senha") !== value) {
                  return "As senhas não batem";
                }
              },
            })}
            placeholder="Repita a senha criada acima"
          />
        </span>
        {errors.confirmarSenha && (
          <p className="error">{errors.confirmarSenha.message}</p>
        )}

        {errorMessages.general && <p className="error">{errorMessages.general}</p>} 

        <Button type="submit" children="Cadastrar" />
      </form>
    </motion.section>
  );
};

export default RegisterForm;
