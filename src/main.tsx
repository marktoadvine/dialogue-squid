import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The font is the app's job, not the component's — importing it inside
// ClemDialogue would make @fontsource/slackey a hard build dependency for
// anyone who copies the folder without installing it.
import '@fontsource/slackey'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
