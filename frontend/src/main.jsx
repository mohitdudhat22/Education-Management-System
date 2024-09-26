import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { GlobalProvider } from './contexts/GlobalContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GlobalProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </GlobalProvider>
    </BrowserRouter>
  </StrictMode>,
)
