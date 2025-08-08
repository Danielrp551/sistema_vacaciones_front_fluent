import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeIcons } from '@fluentui/react';
import { AuthProvider } from './context/AuthContext';
import { LayoutProvider } from './context/LayoutContext';

initializeIcons();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </AuthProvider>
  </StrictMode>,
)
