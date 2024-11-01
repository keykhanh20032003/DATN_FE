import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/reducers';
import Types from './redux/types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './pages/layout';
import './static/css/bootstrap.min.css';
import path from './constants/path';
import CheckOut from './pages/checkOut';
import ThankYou from './pages/checkOut/thankyou';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.AuthReducer.user);
  const token = useSelector((state: RootState) => state.AuthReducer.token);

  const checkData = () => {
    const userLocal = localStorage.getItem('user');
    const tokenLocal = localStorage.getItem('token');
    const parseUser = userLocal ? JSON.parse(userLocal) : null;
    if (tokenLocal && parseUser && !token) {
      dispatch({
        type: Types.LOGIN,
        value: { user: parseUser, token: tokenLocal },
      });
    }
  };
  React.useEffect(() => {
    if (!user) {
      checkData();
    }
  }, [user]);
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path={path.checkOut} element={<CheckOut />} />
        <Route path={path.thankYou} element={<ThankYou />} />

        <Route path="*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
