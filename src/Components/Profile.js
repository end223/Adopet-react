import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/auth";
import loggedUser from "../assets/logged-user.png";
import { api } from "../api";

function Profile() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ nome: "", telefone: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && user.id) {
          const response = await api.get(`/tutores/id/${user.id}`);
          setUserData({
            nome: response.data.nome,
            telefone: response.data.telefone,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [user]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/tutores/id/${user.id}`, {
        nome: data.name,
        telefone: data.phone,
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      className='message'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p>Esse é o perfil que aparece para responsáveis ou ONGs que recebem sua mensagem.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <legend>Perfil</legend>
        <div className="user-pic">
          <label htmlFor='user-pic'>Foto</label>
          <img id='userPic' src={loggedUser} alt="Usuário logado" />
          <a href="#">Clique na foto para editar</a>
        </div>

        <div className="user-info">
          <label htmlFor="name">Nome</label>
          <input
            id='name'
            type="text"
            {...register("name", {
              required: 'É necessário informar seu nome',
              maxLength: { value: 40, message: 'O número máximo de caracteres é 40' }
            })}
            placeholder='Insira seu nome completo'
            readOnly={!isEditing}
            defaultValue={userData.nome} 
          />
          {errors.name && <p className="error">{errors.name.message}</p>}

          <label htmlFor="phone">Telefone</label>
          <input
            type="tel"
            id='phone'
            {...register('phone', {
              required: 'Informe um número de telefone',
              pattern: /\(?[1-9]{2}\)?\s?9?[0-9]{8}/
            })}
            placeholder='Insira seu telefone e/ou whatsapp'
            readOnly={!isEditing}
            defaultValue={userData.telefone} 
          />
          {errors.phone && <p className="error">{errors.phone.message || 'Por favor, verifique o número digitado'}</p>}

        </div>

        {isEditing ? (
          <motion.button
            type="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Confirmar
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={toggleEditing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Editar
          </motion.button>
        )}
      </form>
    </motion.div>
  );
}

export default Profile;
