import React, { useState } from "react";
import { api } from "../api";
import Button from "../Components/Button";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  const onSubmit = async (data) => {
    const { novaSenha, confirmarSenha } = data;

    if (novaSenha !== confirmarSenha) {
      setErrorMessages({ general: "As senhas não coincidem" });
      return;
    }

    try {
      const response = await api.post(`/redefinir-senha/${token}`, { novaSenha });
      setMessage(response.data.message);

      if (response.data.error) {
        setErrorMessages({ general: response.data.error });
      }
    } catch (error) {
      setMessage("Erro ao redefinir a senha.");
    }
  };

  return (
    <motion.div className="register">
      <h1>Redefinir Senha</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="novaSenha">Nova Senha</label>
        <input
          type="password"
          id="novaSenha"
          {...register("novaSenha", {
            required: "Insira sua nova senha",
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
              message: "A senha deve conter pelo menos uma letra maiúscula, um número e ter entre 6 e 15 caracteres",
            },
          })}
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          placeholder="Insira sua nova senha"
        />

        <label htmlFor="confirmarSenha">Confirmar Senha</label>
        <input
          type="password"
          id="confirmarSenha"
          {...register("confirmarSenha", {
            required: "Confirme a nova senha",
            validate: (value) => value === watch("novaSenha") || "As senhas não coincidem",
          })}
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          placeholder="Confirme a nova senha"
        />

        {errors.novaSenha && (
          <p className="error">{errors.novaSenha.message}</p>
        )}

        {errors.confirmarSenha && (
          <p className="error">{errors.confirmarSenha.message}</p>
        )}

        {errorMessages.general && <p className="error">{errorMessages.general}</p>}
        <Button type="submit" children="Redefinir Senha" />
        <p>{message}</p>
      </form>
      <Link to="/login" className="register__login">
        Voltar para o login
      </Link>
    </motion.div>
  );
};




export default ResetPassword;
