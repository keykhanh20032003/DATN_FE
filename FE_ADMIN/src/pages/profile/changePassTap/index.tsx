import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import Types from '~/redux/types';

const ChangePass = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [cfPass, setCfPass] = useState('');

  const changePass = async () => {
    if (!!token) {
      try {
        const data = {
          oldPassword: oldPass,
          newPassword: newPass,
          cfNewPassword: cfPass,
        };
        const url = Api.changePassword(user.id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
            data: data,
          }),
        ]);
        if (res.status) {
          navigate(path.login);
          toast.success(`${res.data}. Vui lòng đăng nhập lại!`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          localStorage.setItem('user', null);
          localStorage.setItem('token', '');
          dispatch({ type: Types.LOGOUT });
        } else {
          toast.error(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Đổi mật khẩu</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Mật khẩu cũ : </div>
          <div className="w-[70%] flex items-center">
            <input
              type="password"
              className="w-[70%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Mật khẩu cũ"
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Mật khẩu mới :</div>
          <div className="w-[70%] flex items-center">
            <input
              type="password"
              className="w-[70%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Mật khẩu mới"
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Nhập lại mật khẩu mới :</div>
          <div className="w-[70%] flex items-center">
            <input
              type="password"
              className="w-[70%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Nhập lại mật khẩu mới"
              onChange={(e) => setCfPass(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center mt-3">
          <div
            className="w-[30%] flex justify-center items-center bg-blue rounded-md h-10 cursor-pointer"
            onClick={changePass}
          >
            <span className="text-base text-black font-bold">Đổi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
