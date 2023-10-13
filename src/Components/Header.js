import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import userPic from '../assets/user.svg';
import loggedUser from '../assets/logged-user.png';
import Button from './Button';
import { AuthContext } from '../contexts/auth';
import { AuthContextAbrigos } from '../contexts/AuthContextAbrigos';


const Header = () => {
  const location = useLocation();
  const [user, setUser] = useState('');
  const { signed, signOut } = useContext(AuthContext);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);  

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/login/abrigo'
    || location.pathname === '/cadastro' || location.pathname === '/dashboard/abrigo' 
    || location.pathname === '/perfil/abrigo'|| location.pathname === '/login' || location.pathname === '/redefinir-senha') {
      setUser(''); 
    } else if (signed) {
      setUser(
        <Menu>
          <Menu.Button className="menu__button">
            <img className='header__user' src={loggedUser} alt="Usuário" />
          </Menu.Button>
          <Menu.Items className='menu__content'>
            <Link className='button' href="/perfil">Ver Perfil</Link>
            <Button handleClick={handleLogout} children="Logout"></Button>
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
            <Link className='button' href="/login">Login</Link>
          </Menu.Items>
        </Menu>
      );
    }
  }, [location, handleLogout, signed]);

  return (
    <header className='header'>
      <nav>
        <div>
          <img className='header__logo' src="logo-clear.svg" alt="" aria-hidden='true' />
          {
            !location.pathname.startsWith('/dashboard/abrigo') &&
            !location.pathname.startsWith('/perfil/abrigo') && (
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


export default Header;
