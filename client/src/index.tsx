import React from 'react';
import ReactDOM from 'react-dom/client';
import { SetupGame } from './game';
import App from './ui/App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('ui')!);
root.render(<App />);
SetupGame();
