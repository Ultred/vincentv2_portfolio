import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/host-grotesk';
import '@fontsource-variable/bodoni-moda/opsz.css';
import '@fontsource-variable/bodoni-moda/opsz-italic.css';
import './index.css';
import App from './App.jsx';
import Blog from './Blog.jsx';

// /blog is served from blog.html (its own head for search engines); either address is the blog
const isBlog = /^\/blog(\.html)?\/?$/.test(window.location.pathname);

createRoot(document.getElementById('root')).render(<StrictMode>{isBlog ? <Blog /> : <App />}</StrictMode>);

// the blog has no 3D to wait for; the home page lifts the loader when its intro begins
if (isBlog) window.__loader?.done();
else window.__loader?.set(0.2);
