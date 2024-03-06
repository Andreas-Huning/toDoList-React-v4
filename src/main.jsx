import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import reducer from './redux/reducer.js'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'

const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)