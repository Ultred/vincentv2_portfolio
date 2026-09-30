import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/host-grotesk';
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import './index.css';
import App from './App.jsx';
import Blog from './Blog.jsx';

const isBlog = window.location.pathname.replace(/\/+$/, '') === '/blog';

createRoot(document.getElementById('root')).render(<StrictMode>{isBlog ? <Blog /> : <App />}</StrictMode>);
