import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { AuthProvider } from './components/api/Authorization/authContext';
import { ToastProvider } from './components/widgets/toast/ToastProvider';
import Toast from './components/widgets/toast/Toast';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ToastProvider>
    <AuthProvider>
      <Toast />
      <App />
    </AuthProvider>
  </ToastProvider>
);
