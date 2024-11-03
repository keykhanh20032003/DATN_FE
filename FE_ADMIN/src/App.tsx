import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/user/login';
import Layout from './pages/layout';
import 'react-toastify/dist/ReactToastify.css';
import Types from './redux/types';
import { ToastContainer, toast } from 'react-toastify';
import { RootState } from './redux/reducers';
import path from './constants/path';
import ForgotPassword from './pages/user/forgotpass';
import jwt_decode from 'jwt-decode';
import { User } from './types/user.type';

const App = () => {
  const dispatch = useDispatch();
  const user: User = useSelector((state: RootState) => state.ReducerAuth.user);
  const token = useSelector((state: RootState) => state.ReducerAuth.token);

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
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
      return decodedToken.exp < currentTime; // Kiểm tra nếu thời gian hết hạn của token nhỏ hơn thời gian hiện tại
    } catch (error) {
      return true; // Xảy ra lỗi khi giải mã token, coi như token đã hết hạn
    }
  };
  const checkTokenExpired = () => {
    if (token && isTokenExpired(token)) {
      toast.error('Vui lòng đăng nhập lại', {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
      <Navigate to={path.login} />;
    }
  };
  React.useEffect(() => {
    checkTokenExpired();
  }, []);

  React.useEffect(() => {
    if (!user) {
      checkTokenExpired();
    }
  }, [user]);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path={path.login} element={<Login />} />
        <Route path={path.forgotpass} element={<ForgotPassword />} />
        <Route path="*" element={!token ? <Navigate to={path.login} replace /> : <Layout />} />
      </Routes>
    </Router>
  );
};

export default App;
