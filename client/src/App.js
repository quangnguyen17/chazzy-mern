// React
import React from 'react';
import { Router } from '@reach/router';

// Components
import LoginRes from './components/LoginRes';
import Dashboard from './components/Dashboard';

// CSS & Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className="App container-fluid p-0">
      <Router>
        <Dashboard path='/dashboard' />
        <Dashboard path='/' />
        <LoginRes path='/welcome' />
      </Router>
    </div>
  );
}

export default App;
