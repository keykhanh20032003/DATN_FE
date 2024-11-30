import React from 'react';
import LeftPage from './components/leftPage';
import { Link, useNavigate } from 'react-router-dom';
import InputText from '~/components/inputText';
import SpinLoading from '~/components/loading/spinLoading';
import authApi from '~/api/auth.apis';
import { toast } from 'react-toastify';
import path from '~/constants/path';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [linkSent, setLinkSent] = React.useState(false);
  const [username, setUsername] = React.useState('');

  const handleForgotPass = async () => {
    try {
      setLoading(true);
      const res = await authApi.forgotPassword(username);
      console.log(res);

      if (res.data.status) {
        setLoading(false);
        setLinkSent(true);
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
    <div className="w-full h-full min-h-[95vh] bg-white flex items-center justify-center no-scrollbar">
      <div className="mx-auto w-full max-w-5xl shadow-xl border rounded-lg">
        <div className="flex items-center justify-around rounded-xl">
          <div className="">
            <LeftPage />
          </div>
          <div className="bg-black w-[2px] h-96"></div>
          <div className="py-24 px-10 w-[40%]">
            <h2 className="text-2xl font-semibold mb-2 text-center text-blue">Quên mật khẩu</h2>

            {linkSent && (
              <>
                <div className="text-center mt-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#2999ff"
                    aria-hidden="true"
                    className="inline-block w-32 text-success"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="my-4 text-xl font-bold text-center">Đã gửi</p>
                <p className="mt-4 mb-8 font-semibold text-center">Kiểm tra mật khẩu trong email của bạn</p>
                <div className="flex items-center justify-center text-center mt-4">
                  <div
                    className="mt-2 w-full h-10 bg-[#2999ff] rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() => navigate(path.login)}
                  >
                    <span>Đăng nhập</span>
                  </div>
                </div>
              </>
            )}

            {!linkSent && (
              <>
                <p className="my-8 font-semibold text-center">
                  Chúng tôi sẽ gửi mật khẩu mới vào email đã đăng kí tài khoản này của bạn
                </p>
                <div>
                  <div className="mb-4">
                    <InputText
                      containerStyle="mt-4"
                      labelTitle=""
                      placeholder="Nhập tên tài khoản của bạn"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  {loading ? (
                    <SpinLoading />
                  ) : (
                    <button
                      type="submit"
                      className="mt-2 w-full h-10 bg-[#2999ff] rounded-md"
                      onClick={handleForgotPass}
                    >
                      Gửi
                    </button>
                  )}

                  <div className="text-center mt-4" onClick={() => navigate(-1)}>
                    <div className="flex justify-center items-center text-[#ff3d3d] hover:text-[#2999ff] hover:cursor-pointer transition duration-200">
                      <i className="bx bx-left-arrow-alt pr-1"></i> Quay lại
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
