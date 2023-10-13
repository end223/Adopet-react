import React, { useContext } from 'react';
import { Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthContextAbrigos, AuthProviderAbrigos } from '../contexts/AuthContextAbrigos';
import LoginAbrigo from './LoginAbrigo';
import AbrigoHome from './AbrigoHome';
import AbrigoProfile from "./ProfileAbrigo";
import HeaderAbrigo from './HeaderAbrigo'

const PrivateRoute = ({ element: Component }) => {
  const { signedAbrigo } = useContext(AuthContextAbrigos);
  
  if(!signedAbrigo) {
    return <Navigate to="/login/abrigo" />
  }

  return <Component />;
};

const AnimatedRoutesAbrigos = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <AuthProviderAbrigos>
        <HeaderAbrigo />
        <Routes location={location} key={location.pathname}>
          <Route path="/login/abrigo" element={<LoginAbrigo />} />
          <Route
            path="/dashboard/abrigo"
            element={<PrivateRoute element={AbrigoHome} />}
          />
          <Route
            path="/perfil/abrigo"
            element={<PrivateRoute element={AbrigoProfile} />}
          />
          <Route
            path="/"
            element={<Outlet />}
          />
        </Routes>
      </AuthProviderAbrigos>
    </AnimatePresence>
  );
};

export default AnimatedRoutesAbrigos;
