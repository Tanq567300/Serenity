import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Use different paths for development vs production
      const swUrl = import.meta.env.MODE === 'production' 
        ? '/sw.js' 
        : new URL('./sw.js', import.meta.url).href;
        
      const registration = await navigator.serviceWorker.register(swUrl, {
        type: 'module'
      });
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}