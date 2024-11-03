import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import Modal from 'react-modal';
Modal.setAppElement('#root');

import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './assets/css/grid.css';
import './assets/css/index.css';
import './assets/css/theme.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
);
