import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';
import './global.css';

const root = document.getElementById('root')!;
createRoot(root).render(<App />);
