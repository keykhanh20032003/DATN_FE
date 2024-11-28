import React from 'react';
import '../styles.css';
import { Link, useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import { useDispatch } from 'react-redux';
import authApi from '~/apis/auth.apis';
import { toast } from 'react-toastify';
import Types from '~/redux/types';
import SpinLoading from '~/components/spinloading';

const Login = () => {
  const [isForgotPass, setIsForgotPass] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!username) {
        toast.error(`Vui lòng nhập tên tài khoản`, {
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!password) {
        toast.error(`Vui lòng nhập mật khẩu`, {
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      const data = {
        username,
        password,
      };
      const res = await authApi.login(data);
      if (res.data.status) {
        setLoading(false);
        navigate('/');
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        dispatch({ type: Types.LOGIN, value: { user: res.data.data.user, token: res.data.data.token } });
      } else {
        setLoading(false);
        toast.error(`${res.data.data}`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      setLoading(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPass = async () => {
    try {
      setLoading(true);
      const res = await authApi.forgotPassword(username);
      if (res.data.status) {
        setLoading(false);
        toast.success(`${res.data.data}`, {
          position: 'top-right',
          autoClose: 3000,
          pauseOnHover: false,
          theme: 'dark',
        });
      } else {
        setLoading(false);
        toast.error(`${res.data.data}`, {
          position: 'top-right',
          autoClose: 3000,
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="layout-account">
      <div className="container">
        <div className="wrapbox-content-account">
          <div id="customer-login" className="customers_accountForm customer_login">
            <div className="tab-form-account d-flex align-items-center justify-content-center">
              <h4 className="active">
                <Link to={path.login}>Đăng nhập</Link>
              </h4>
              <h4>
                <Link to={path.register}>Đăng ký</Link>
              </h4>
            </div>
            {isForgotPass === false && (
              <div id="login">
                <div className="accounttype">
                  <h2 className="title" />
                </div>
                <div>
                  <input name="form_type" type="hidden" defaultValue="customer_login" />
                  <input name="utf8" type="hidden" defaultValue="✓" />
                  <div className="clearfix large_form">
                    <label htmlFor="customer_email" className="icon-field">
                      <i className="icon-login icon-envelope " />
                    </label>
                    <input
                      type="text"
                      id="customer_email"
                      placeholder="Vui lòng nhập tên tài khoản"
                      className="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="clearfix large_form large_form-mrb">
                    <label htmlFor="customer_password" className="icon-field">
                      <i className="icon-login icon-shield" />
                    </label>
                    <input
                      type="password"
                      placeholder="Vui lòng nhập mật khẩu"
                      className="text"
                      size={16}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="clearfix custommer_account_action">
                    {loading ? (
                      <div className="spinload">
                        <SpinLoading />
                      </div>
                    ) : (
                      <div className="action_bottom button">
                        <div className="button btn-signin" onClick={handleLogin}>
                          <span>Đăng nhập</span>
                        </div>
                      </div>
                    )}
                    <div className="req_pass">
                      <p>
                        Bạn chưa có tài khoản?
                        <Link to={path.register} title="Đăng ký">
                          {' '}
                          Đăng ký
                        </Link>
                      </p>
                      <p>
                        Bạn quên mật khẩu?
                        <span className="forgot-pass" title="Quên mật khẩu" onClick={() => setIsForgotPass(true)}>
                          {' '}
                          Quên mật khẩu?
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isForgotPass && (
              <div id="recover-password">
                <div>
                  <input name="form_type" type="hidden" defaultValue="recover_customer_password" />
                  <input name="utf8" type="hidden" defaultValue="✓" />
                  <div className="clearfix large_form large_form-mrb">
                    <label htmlFor="email" className="icon-field">
                      <i className="icon-login icon-envelope " />
                    </label>
                    <input
                      type="text"
                      size={30}
                      placeholder="Vui lòng nhập tài khoản của bạn"
                      className="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="clearfix custommer_account_action">
                    {loading ? (
                      <div className="spinload">
                        <SpinLoading />
                      </div>
                    ) : (
                      <div className="action_bottom button" onClick={handleForgotPass}>
                        <div className="btn">
                          <span>Gửi</span>
                        </div>
                      </div>
                    )}
                    <div className="req_pass">
                      Quay lại{' '}
                      <span className="forgot-pass" onClick={() => setIsForgotPass(false)}>
                        đăng nhập
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
