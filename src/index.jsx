import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import { UserProvider, ErrorModalProvider } from './contexts';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <ErrorModalProvider>
        <App />
      </ErrorModalProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
