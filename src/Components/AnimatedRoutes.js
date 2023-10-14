import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from "../contexts/auth";
import Initial from './Initial';
import LoginForm from "./LoginForm.js";
import Home from "./Home.js";
import Message from "./Message.js";
import Profile from "./Profile";
import RegisterForm from "./RegisterForm.js";
import Header from "./Header";
import { PrivateRoute } from "../contexts/privateRoutes";
import ForgotPassword from "../contexts/ForgotPassword";
import ResetPassword from "../contexts/ResetPassword";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <AuthProvider>
        <Header />
        <Routes location={location} key={location.pathname}>
          <Route exact path='/' element={<Initial />} />
          <Route path='/login' element={<LoginForm />} />          
          <Route path='/cadastro' element={<RegisterForm />} />
          <Route path="/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/redefinir-senha/:token" element={<ResetPassword />} />
          <Route path="/home" element={<PrivateRoute location={location} />}>
            <Route path="/home" element={<Home />} />
          </Route>
            <Route path="/perfil" element={<Profile />} />
          <Route path="/mensagem" element={<PrivateRoute />}>
            <Route path="/mensagem" element={<Message />} />
          </Route>
        </Routes>
      </AuthProvider>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
