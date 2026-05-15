import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChallengeProvider } from './context/ChallengeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChallengeProvider>
      <App />
    </ChallengeProvider>
  </StrictMode>,
);
