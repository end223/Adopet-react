import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import CardPet from './CardPet';

const TutorHome = () => {
  const [pets, setPets] = useState([]);
  const [abrigoNames, setAbrigoNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

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
        response.data.forEach((abrigo) => {
          abrigoNameMap[abrigo.id] = abrigo.ong;
        });
        setAbrigoNames(abrigoNameMap);
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

  return (
    <motion.section className='home' initial={{ width: 0 }} animate={{ width: 'auto', transition: { duration: 0.5 } }} exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}>
      <p>Olá Tutor! <br /> Veja os amigos disponíveis para adoção!</p>
      <div className='cards'>
        {pets.map((pet) => (
          <CardPet
            age={pet.idade}
            size={pet.porte}
            behavior={pet.descricao}
            city={pet.endereco}
            name={pet.nome}
            img={pet.imagem}
            key={pet.id}
            abrigo={abrigoNames[pet.abrigos_id]}
          />
        ))}
      </div>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Página anterior</button>
        <button onClick={nextPage}>Próxima página</button>
      </div>
    </motion.section>
  );
};

export default TutorHome;
