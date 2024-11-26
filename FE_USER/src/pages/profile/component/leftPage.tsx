import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import Types from '~/redux/types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import authApi from '~/apis/auth.apis';

const LeftPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await authApi.logout();
    if (res.status) {
      localStorage.setItem('user', null);
      localStorage.setItem('token', '');
      dispatch({ type: Types.LOGOUT });
      navigate(path.login);
    } else {
      toast.error('Lỗi', {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  return (
    <div className="col-lg-3 col-md-12 col-12 sidebar-account">
      <div className="AccountSidebar">
        <h3 className="AccountTitle titleSidebar">Tài khoản</h3>
        <div className="AccountContent">
          <div className="AccountList">
            <ul className="list-unstyled">
              <li className="current">
                <Link to={path.profile}>Thông tin tài khoản</Link>
              </li>
              <li>
                <Link to={path.address}>Danh sách địa chỉ</Link>
              </li>
              <li>
                <Link to={path.address}>Đổi mật khẩu</Link>
              </li>
              <li className="last" onClick={handleLogout}>
                <Link to={path.login}>Đăng xuất</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPage;
