import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChallengeProvider } from './context/ChallengeContext';
import { TimeTrackingProvider } from './context/TimeTrackingContext';
import { MediaProvider } from './context/MediaContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimeTrackingProvider>
      <MediaProvider>
        <ChallengeProvider>
          <App />
        </ChallengeProvider>
      </MediaProvider>
    </TimeTrackingProvider>
  </StrictMode>,
);
