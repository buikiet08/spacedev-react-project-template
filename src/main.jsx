import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './stories'
import { TranslateProvider } from './components/TranslateProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <TranslateProvider>
        <App />
      </TranslateProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
)
