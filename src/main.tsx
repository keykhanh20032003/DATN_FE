import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './static/css/index.css';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import Modal from 'react-modal';
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
);
