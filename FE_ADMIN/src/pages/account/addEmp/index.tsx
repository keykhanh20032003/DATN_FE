import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Images from '~/assets';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import path from '~/constants/path';

const AddEmp = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const AddEmp = async () => {
    if (!!token) {
      const phoneNumberRegex = /^0[0-9]{9}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      if (!email) {
        toast.error('Hãy nhập email', {
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
      try {
        const data = {
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
        };
        const url = Api.addEmp();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            data: data,
            token: token,
          }),
        ]);
        if (res.status) {
          navigate(path.accounts);
          toast.success(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
          toast.error(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        toast.error('Bạn không có quyền thêm mới nhân viên', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thêm mới nhân viên</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Tài khoản :</div>
          <div className="w-[70%] flex items-center">
            <input
              className="w-[100%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Tên tài khoản"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Mật khẩu :</div>
          <div className="w-[70%] flex items-center">
            <input
              type="password"
              className="w-[100%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Họ và Tên :</div>
          <div className="w-[70%] flex items-center justify-between">
            <input
              className="w-[65%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Họ"
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              className="w-[30%] rounded-md h-10 pl-2 border-[#737373] ml-3"
              placeholder="Tên"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Email :</div>
          <div className="w-[70%] flex items-center">
            <input
              className="w-[100%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Số điện thoại :</div>
          <div className="w-[70%] flex items-center">
            <input
              className="w-[100%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder="Số điện thoại"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center mt-3 ml-[30%]">
          <div
            className="w-[30%] flex justify-center items-center bg-blue rounded-md h-10 cursor-pointer"
            onClick={() => AddEmp()}
          >
            <span className="text-black font-bold">Tạo mới</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmp;
