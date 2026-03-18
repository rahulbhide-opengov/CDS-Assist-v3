import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@opengov/capital-mui-theme/dist/fonts.css'
import './global.css'
import App from './App.tsx'

// Temporarily suppress warnings from third-party libraries
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('Support for defaultProps will be removed') ||
    args[0].includes('No friendly id provided') ||
    args[0].includes('maxPagesToShow') ||
    args[0].includes('validateDOMNesting')
  )) {
    return;
  }
  originalError.apply(console, args);
};

console.warn = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('maxPagesToShow') ||
    args[0].includes('validateDOMNesting')
  )) {
    return;
  }
  originalWarn.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
