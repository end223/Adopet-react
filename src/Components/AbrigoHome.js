import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import CardPetAbrigo from './CardPetAbrigo';

const AbrigoHome = () => {
  const [pets, setPets] = useState([]);
  const [abrigoNames, setAbrigoNames] = useState({});
  const [abrigoList, setAbrigoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [showPetForm, setShowPetForm] = useState(false);
  const [newPet, setNewPet] = useState({
    abrigos_id: '',
    nome: '',
    descricao: '',
    adotado: false,
    idade: '',
    porte: '',
    endereco: '',
    imagem: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    nome: '',
    descricao: '',
    idade: '',
    porte: '',
    endereco: '',
    imagem: '',
  });

  const validateForm = () => {
    const errors = {};
  
    if (!newPet.nome) {
      errors.nome = 'Nome é obrigatório.';
    }
  
    if (!newPet.descricao) {
      errors.descricao = 'Descrição é obrigatória.';
    }
  
    if (!newPet.idade) {
      errors.idade = 'Idade é obrigatória.';
    }
  
    if (!newPet.porte) {
      errors.porte = 'Porte é obrigatório.';
    }
  
    if (!newPet.endereco) {
      errors.endereco = 'Endereço é obrigatório.';
    }
  
    if (!newPet.imagem) {
      errors.imagem = 'URL da imagem é obrigatória.';
    }
  
    return errors;
  };
  

  useEffect(() => {
    const loadPets = async () => {
      try {
        const response = await api.get(`/pets?page=${currentPage}`);
        setPets(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadPets();

    api.get('/abrigos')
      .then((response) => {
        const abrigoNameMap = {};
        const abrigos = response.data;
        abrigos.forEach((abrigo) => {
          abrigoNameMap[abrigo.id] = abrigo.ong;
        });
        setAbrigoNames(abrigoNameMap);
        setAbrigoList(abrigos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const removePet = async (id) => {
    try {
      await api.delete(`/pets/id/${id}`);

      const response = await api.get(`/pets?page=${currentPage}`);
      setPets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const adoptPet = async (id) => {
    try {
      await api.post('/adocao', { pet: id });

      const response = await api.get(`/pets?page=${currentPage}`);
      setPets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const showConfirmation = (petId, action) => {
    setSelectedPetId(petId);
    setActionToConfirm(action);
    setShowConfirmationDialog(true);
  };

  const confirmAction = () => {
    if (actionToConfirm === 'remove') {
      removePet(selectedPetId);
    } else if (actionToConfirm === 'adopt') {
      adoptPet(selectedPetId);
    }
    setShowConfirmationDialog(false);
  };

  const togglePetForm = () => {
    setShowPetForm(!showPetForm);
  };

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    setNewPet({
      ...newPet,
      [name]: value,
    });
  };

  const handlePetSubmit = async (e) => {
    e.preventDefault();
  
    const errors = validateForm();
  
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
  
    setFieldErrors({});
  
    try {
      await api.post('/pets', newPet);

      setShowPetForm(false);
      const response = await api.get(`/pets?page=${currentPage}`);
      setPets(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <motion.section className='home' initial={{ width: 0 }} animate={{ width: 'auto', transition: { duration: 0.5 } }} exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}>
      <p>Olá Abrigo! <br /> Veja os amigos disponíveis!</p>
      <div className='cards'>
        {pets.map((pet) => (
          <CardPetAbrigo
            age={pet.idade}
            size={pet.porte}
            behavior={pet.descricao}
            city={pet.endereco}
            name={pet.nome}
            img={pet.imagem}
            key={pet.id}
            pet={pet}
            removePet={removePet}
            showConfirmation={showConfirmation}
            abrigo={abrigoNames[pet.abrigos_id]}
          >
            <button onClick={() => showConfirmation(pet.id, 'remove')}>Remover</button>
            <button onClick={() => showConfirmation(pet.id, 'adopt')}>Adotar</button>
          </CardPetAbrigo>
        ))}
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Página anterior</button>
        <button onClick={nextPage}>Próxima página</button>
      </div>
      {showConfirmationDialog && (
        <div className="confirmation-dialog">
          <p>Deseja confirmar esta ação?</p>
          <button onClick={confirmAction}>Sim</button>
          <button onClick={() => setShowConfirmationDialog(false)}>Cancelar</button>
        </div>
      )}
      <button onClick={togglePetForm}>Cadastrar Pet</button>
      {showPetForm && (
        <div className="pet-form-container">
          <div className="pet-form-card">
            <h2>Cadastrar Novo Pet</h2>
            <form onSubmit={handlePetSubmit}>
              <select name="abrigos_id" onChange={handlePetChange}>
                <option value="">Escolha um abrigo</option>
                {abrigoList.map((abrigo) => (
                  <option key={abrigo.id} value={abrigo.id}>
                    {abrigo.ong}
                  </option>
                ))}
              </select>
              <input type="text" name="nome" placeholder="Nome" onChange={handlePetChange} />
              {fieldErrors.nome && <p className="error-message">{fieldErrors.nome}</p>}
              <input type="text" name="descricao" placeholder="Descrição" onChange={handlePetChange} />
              {fieldErrors.descricao && <p className="error-message">{fieldErrors.descricao}</p>}
              <input type="text" name="idade" placeholder="Idade" onChange={handlePetChange} />
              {fieldErrors.idade && <p className="error-message">{fieldErrors.idade}</p>}
              <input type="text" name="porte" placeholder="Porte" onChange={handlePetChange} />
              {fieldErrors.porte && <p className="error-message">{fieldErrors.porte}</p>}
              <input type="text" name="endereco" placeholder="Endereço" onChange={handlePetChange} />
              {fieldErrors.endereco && <p className="error-message">{fieldErrors.endereco}</p>}
              <input type="text" name="imagem" placeholder="URL da Imagem" onChange={handlePetChange} />
              {fieldErrors.imagem && <p className="error-message">{fieldErrors.imagem}</p>}
              <button type="submit">Cadastrar</button>
              <button type="button" className="cancel-button" onClick={togglePetForm}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default AbrigoHome;
