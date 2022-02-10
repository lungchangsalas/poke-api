import React from 'react';
import { BrowserRouter  as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import {Navbar} from './components/layout/NavBar';
import {Dashboard} from './components/layout/Dashboard';
import {Pokemon} from './components/pokemon/Pokemon';

import backgroundImage from './pattern.png';

function App() {
  return (
    <Router>
    <div className="App" style={{background:`url(${backgroundImage})`}}>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route  path='/' element={<Dashboard />} exact /> 
          <Route  path='/pokemon/:pokemonIndex' element={<Pokemon />} exact />  
        </Routes>
      </div>
    </div>
  </Router>
  );
}

export default App;
