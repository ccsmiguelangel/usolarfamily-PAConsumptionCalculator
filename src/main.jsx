import '@fontsource/inter/400.css'; // Peso normal
import '@fontsource/inter/500.css'; // Peso medium
import '@fontsource/inter/700.css'; // Peso bold
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container); // Crear root una sola vez

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);