
const CardPetAbrigo  = ({ age, size, behavior, abrigo, city, name, img, pet, showConfirmation }) => {
  const handleAdoptClick = () => {
    showConfirmation(pet.id, 'adopt');
  };

  const handleRemoveClick = () => {
    showConfirmation(pet.id, 'remove');
  };

  return (
    <div key={pet.id} className='card'>
      <img src={img} alt={name} />
      <h4>{name}</h4>
      <ul>
        <li>{age}</li>
        <li>{size}</li>
        <li>{behavior}</li>
        <li className='red_text'>{abrigo}</li>
      </ul>
      <p className='card__city'>{city}</p>
      <div className="card-button-container">
        <button className="card-button" onClick={handleRemoveClick}>Remover</button>
        <button className="card-button" onClick={handleAdoptClick}>Adotar</button>
      </div>
    </div>
  );
};


export default CardPetAbrigo;



