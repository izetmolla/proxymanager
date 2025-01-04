import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
// Generated Routes
import App from './App'
import { Provider } from 'react-redux'
import store, { persistor } from "./store";
import { PersistGate } from 'redux-persist/integration/react'
import { HelmetProvider } from 'react-helmet-async';


// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </StrictMode>
  )
}