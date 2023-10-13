import { Link } from "react-router-dom";

const CardPet = ({ age, size, behavior, abrigo, city, name, img, index, abrigoTelefone, mensagemPreFormada }) => {
  const formatWhatsAppLink = (phoneNumber, message) => {
    
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    return `https://wa.me/${cleanedPhoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const whatsappLink = formatWhatsAppLink(abrigoTelefone, mensagemPreFormada);

  return (
    <div key={index} className='card'>
      <img src={img} alt={name} />
      <h4>{name}</h4>
      <ul>
        <li>{age}</li>
        <li>{size}</li>
        <li>{behavior}</li>
        <li className='red_text'>{abrigo}</li> 
      </ul>
      <p className='card__city'>{city}</p>
      <Link className='card__contact' href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label='Falar com responsável'>Falar com responsável</Link>
    </div>
  );
};

export default CardPet;
