import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './pages/welcome';
import { initializeTheme } from './hooks/use-appearance';

// Set light / dark mode on load
initializeTheme();

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <Welcome />
        </React.StrictMode>
    );
}

