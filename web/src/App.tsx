import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import Routes from './routes';
import GlobalStyle from './styles/global';

const App: React.FC = () => (
  <Router>
    <GlobalStyle />
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </Router>
);

export default App;
