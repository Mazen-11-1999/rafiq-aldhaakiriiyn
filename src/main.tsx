import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChallengeProvider } from './context/ChallengeContext';
import { TimeTrackingProvider } from './context/TimeTrackingContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeTrackingProvider>
      <ChallengeProvider>
        <App />
      </ChallengeProvider>
    </TimeTrackingProvider>
  </StrictMode>,
);
