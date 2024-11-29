import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import path from '~/constants/path';
import { User } from '~/types/user.type';

const EditProfile = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const userId = useSelector((state: RootState) => state.ReducerAuth.user);

  const navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  const handleEdit = (ref) => {
    if (ref.current) {
      setIsEdit(true);
      ref.current.focus();
    }
  };
  const viewDetail = async () => {
    if (!!token) {
      try {
        const url = Api.detailAcc(userId.id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setUser(res.data);
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
  const updateProfile = async () => {
    if (!!token) {
      try {
        const data = {
          firstName: firstName || user?.firstName,
          lastName: lastName || user?.lastName,
          email: email || user?.email,
          phone: phone || user?.phone,
        };
        const [res] = await Promise.all([
          REQUEST_API({
            url: Api.updateUser(user?.id),
            method: 'post',
            data: data,
            token: token,
          }),
        ]);
        if (res.status) {
          navigate(path.home);
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
        toast.error('Lỗi', {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    viewDetail();
  }, []);
  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thay đổi thông tin</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Họ : </div>
          <div className="w-[70%] flex items-center">
            <input
              ref={lastNameRef}
              className="w-[70%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder={user?.lastName}
              onChange={(e) => setLastName(e.target.value)}
              readOnly={!isEdit}
            />
            <i className="bx bx-edit text-2xl font-semibold cursor-pointer" onClick={() => handleEdit(lastNameRef)}></i>
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Tên : </div>
          <div className="w-[70%] flex items-center">
            <input
              ref={firstNameRef}
              className="w-[70%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder={user?.firstName}
              onChange={(e) => setFirstName(e.target.value)}
              readOnly={!isEdit}
            />
            <i
              className="bx bx-edit text-2xl font-semibold cursor-pointer"
              onClick={() => handleEdit(firstNameRef)}
            ></i>
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Email : </div>
          <div className="w-[70%] flex items-center">
            <input
              ref={emailRef}
              className="w-[100%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder={user?.email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEdit}
            />
            <i className="bx bx-edit text-2xl font-semibold cursor-pointer" onClick={() => handleEdit(emailRef)}></i>
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Số điện thoại : </div>
          <div className="w-[70%] flex items-center">
            <input
              ref={phoneRef}
              className="w-[100%] rounded-md h-10 pl-2 border-[#737373]"
              placeholder={user?.phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!isEdit}
            />
            <i className="bx bx-edit text-2xl font-semibold cursor-pointer" onClick={() => handleEdit(phoneRef)}></i>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3 ml-[30%]">
          <div
            className="w-[30%] flex justify-center items-center bg-blue rounded-md h-10 cursor-pointer"
            onClick={updateProfile}
          >
            <span className="text-base text-black font-bold">Cập nhật</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
