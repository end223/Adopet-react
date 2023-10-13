import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './Components/AnimatedRoutes';
import AnimatedRoutesAbrigos from './Components/AnimatedRoutesAbrigos';

function App() {
  return (
    <Router>
      <main className='App'>
        <AnimatedRoutes /> 
        <AnimatedRoutesAbrigos /> 
      </main>
    </Router>
  );
}

export default App;
