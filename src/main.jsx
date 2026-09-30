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

// the blog has no 3D to wait for; the home page lifts the loader when its intro begins
if (isBlog) window.__loader?.done();
else window.__loader?.set(0.2);
