import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import userPic from '../assets/user.svg';
import abrigoPic from '../assets/logged-abrigo.png';
import Button from './Button';
import { AuthContextAbrigos } from '../contexts/AuthContextAbrigos';

const HeaderAbrigo = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const { signedAbrigo, signOut, user: loggedInUser } = useContext(AuthContextAbrigos);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/login/abrigo' || location.pathname === '/home'
    || location.pathname === '/mensagem' || location.pathname === '/perfil' || location.pathname === '/redefinir-senha') {
      setUser('');
    } else if (signedAbrigo) {
      setUser(
        <Menu>
          <Menu.Button className="menu__button">
            <img className='header__user' src={abrigoPic} alt="Usuário" />
          </Menu.Button>
          <Menu.Items className='menu__content'>
            <Link to="/dashboard/abrigo" className='button'>Home</Link>
            <Link to="/perfil/abrigo" className='button'>Ver Perfil</Link>
            <Button handleClick={handleLogout}>Logout</Button> 
          </Menu.Items>
        </Menu>
      );
    } else {
      setUser(
        <Menu>
          <Menu.Button className="menu__button">
            <img className='header__user' src={userPic} alt="Usuário" />
          </Menu.Button>
          <Menu.Items className='menu__content'>
            <Link to="/login/abrigo" className='button'>Login</Link>
          </Menu.Items>
        </Menu>
      );
    }
  }, [location, handleLogout, signedAbrigo]);

  return (
    <header className='header'>
      <nav>
        { // Verifique se a rota atual é uma rota de abrigo
          location.pathname.startsWith('/dashboard/abrigo') || location.pathname.startsWith('/perfil/abrigo') ? (
            <>
              <Link to="/dashboard/abrigo" className='header__homepet-button'>HomePet</Link>
            </>
          ) : null
        }
        <div>
          {
            !location.pathname.startsWith('/') &&
            !location.pathname.startsWith('/home') && (
              <>
                <Link className='header__home' aria-label='Tela inicial' to="/" ></Link>
                <Link className='header__message' to="/mensagem" aria-label='Ir para Mensagens'></Link>
              </>
            )
          }
        </div>
        {user}
      </nav>
    </header>
  );
};

export default HeaderAbrigo;
