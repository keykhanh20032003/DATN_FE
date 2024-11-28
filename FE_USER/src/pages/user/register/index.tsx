import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '~/apis/auth.apis';
import { toast } from 'react-toastify';
import path from '~/constants/path';
import '../styles.css';
import SpinText from '~/components/spinloading/spinText';

const Register = () => {
  const navigate = useNavigate();
  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loading1, setLoading1] = React.useState(false);

  const handleRegister = async () => {
    try {
      const phoneNumberRegex = /^0[0-9]{9}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-z0-9]{6,15}$/;
      const passwordRegex = /\s/;
      if (!username) {
        toast.error('Hãy nhập tên tài khoản', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!password) {
        toast.error('Hãy nhập mật khẩu', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!email) {
        toast.error('Hãy nhập email', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!lastName) {
        toast.error('Hãy nhập mật tên', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!firstName) {
        toast.error('Hãy nhập mật họ', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!phone) {
        toast.error('Hãy nhập số điện thoại', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!otp) {
        toast.error('Hãy nhập otp', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!usernameRegex.test(username)) {
        toast.error('Tên tài khoản không được chứa ký tự đặc biệt', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (passwordRegex.test(password)) {
        toast.error('Mật khẩu không được chứa dấu cách', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (isNaN(Number(phone)) || !phoneNumberRegex.test(phone)) {
        toast.error('Số điện thoại không hợp lệ', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        setPhone('');
        return;
      }
      if (!emailRegex.test(email)) {
        toast.error('Email không hợp lệ', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        setEmail('');
        return;
      }
      const data = {
        username,
        password,
        firstName,
        lastName,
        email,
        phone,
        otp,
      };
      setLoading(true);
      const res = await authApi.register(data);
      if (res.data.status) {
        setLoading(false);
        navigate(path.login);
        toast.error(`Đăng kí thành công`, {
          pauseOnHover: false,
          theme: 'dark',
        });
      } else {
        setLoading(false);
        toast.error(`${res.data.data}`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGetOtp = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        toast.error(`Vui lòng nhập email để lấy otp`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!emailRegex.test(email)) {
        toast.error('Email không hợp lệ', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        setEmail('');
        return;
      }
      const data = {
        email,
      };
      setLoading1(true);
      const res = await authApi.getOtp(data);
      if (res.data.status) {
        setLoading1(false);

        toast.success(`${res.data.data}`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      } else {
        setLoading1(false);
        toast.error(`${res.data.data}`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      setLoading1(true);
      console.error(error);
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="layout-account">
      <div className="container">
        <div className="wrapbox-content-account">
          <div className="userbox customers_accountForm">
            <div className="tab-form-account d-flex align-items-center justify-content-center">
              <h4>
                <Link to={path.login}>Đăng nhập</Link>
              </h4>
              <h4 className="active">
                <Link to={path.register}>Đăng ký</Link>
              </h4>
            </div>
            <div>
              <input name="form_type" type="hidden" defaultValue="create_customer" />
              <input name="utf8" type="hidden" defaultValue="✓" />
              <div className="clearfix large_form">
                <label htmlFor="last_name" className="label icon-field">
                  <i className="icon-login icon-user " />
                </label>
                <input
                  type="text"
                  placeholder="Họ"
                  id="last_name"
                  className="text"
                  size={30}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="clearfix large_form">
                <label htmlFor="first_name" className="label icon-field">
                  <i className="icon-login icon-user " />
                </label>
                <input
                  type="text"
                  placeholder="Tên"
                  id="first_name"
                  className="text"
                  size={30}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="clearfix large_form">
                <label htmlFor="birthday" className="label icon-field">
                  <i className="icon-login icon-envelope " />
                </label>
                <input
                  type="text"
                  className="text"
                  placeholder="Số điện thoại"
                  size={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="clearfix large_form">
                <label htmlFor="email" className="label icon-field">
                  <i className="icon-login icon-envelope " />
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  className="text"
                  size={30}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="clearfix large_form">
                <label htmlFor="username" className="label icon-field">
                  <i className="icon-login icon-envelope " />
                </label>
                <input
                  type="text"
                  placeholder="Tên tài khoản"
                  id="username"
                  className="text"
                  size={30}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="clearfix large_form large_form-mrb">
                <label htmlFor="password" className="label icon-field">
                  <i className="icon-login icon-shield " />
                </label>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  id="password"
                  className="password text"
                  size={30}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="clearfix large_form large_form-mrb otp">
                <div className="otp-1">
                  <input
                    type="text"
                    placeholder="Nhập otp"
                    className="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="action_bottom button otp-2">
                  <div className="button btn-signin" onClick={handleGetOtp}>
                    {loading1 ? <SpinText /> : <span>Gửi</span>}
                  </div>
                </div>
              </div>
              <div className="clearfix custommer_account_action">
                <div className="action_bottom button">
                  <div className="button btn-signin" onClick={handleRegister}>
                    {loading ? <SpinText /> : <span>Đăng kí</span>}
                  </div>
                </div>
                <div className="req_pass">
                  Bạn đã có tài khoản? <Link to={path.login}>Đăng nhập ngay</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
