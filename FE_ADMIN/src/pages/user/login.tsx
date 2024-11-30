import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LeftPage from './components/leftPage';
import InputText from '~/components/inputText';
import authApi from '~/api/auth.apis';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Types from '~/redux/types';
import SpinLoading from '~/components/loading/spinLoading';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = {
        username,
        password,
      };
      const res = await authApi.login(data);
      if (res.data.status) {
        setLoading(false);
        if (res.data.data.user.roles[0].name == 'ROLE_ADMIN' || res.data.data.user.roles[0].name == 'ROLE_EMPLOYEE') {
          navigate('/');
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
          dispatch({ type: Types.LOGIN, value: { user: res.data.data.user, token: res.data.data.token } });
        } else {
          toast.error('Bạn không phải là nhân viên', {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
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

  return (
    <div className="w-full h-full min-h-[95vh] bg-white flex items-center justify-center no-scrollbar">
      <div className="mx-auto w-full max-w-5xl shadow-xl border rounded-lg">
        <div className="flex items-center justify-around rounded-xl">
          <div className="">
            <LeftPage />
          </div>
          <div className="bg-black w-[2px] h-96"></div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center text-[#2999ff]">Đăng nhập</h2>
            <div className="mb-4">
              <InputText
                type="text"
                containerStyle="mt-4"
                labelTitle="Tài khoản"
                onChange={(e) => setUserName(e.target.value)}
                // labelStyle="text-[#2999ff] "
              />

              <InputText
                type="password"
                containerStyle="mt-4"
                labelTitle="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                // labelStyle="text-[#2999ff] "
              />
              {/* <div className="flex items-center justify-between">
                  <InputText containerStyle="mt-4 w-[65%] " labelTitle="" onChange={(e) => setOtp(e.target.value)} />
                  <div className="w-[30%] h-10 bg-[#2999ff] rounded-md mt-4 flex items-center justify-center cursor-pointer">
                    <span>Lấy OTP</span>
                  </div>
                </div> */}
            </div>
            <div className="text-right">
              <Link to="/forgot-password">
                <span className="text-sm inline-block hover:text-[#2999ff] hover:cursor-pointer transition duration-200">
                  Quên mật khẩu?
                </span>
              </Link>
            </div>
            {loading ? (
              <SpinLoading />
            ) : (
              <button onClick={() => handleLogin()} type="submit" className="mt-2 w-full h-10 bg-[#2999ff] rounded-md">
                Đăng nhập
              </button>
            )}
            <div className="text-center mt-4">
              Bạn chưa có tài khoản ?&nbsp;
              <Link to="/register">
                <span className="inline-block text-[#ff3d3d] hover:text-[#2999ff] hover:underline hover:cursor-pointer transition duration-200">
                  Liên hệ ADMIN
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
