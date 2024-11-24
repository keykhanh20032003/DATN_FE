import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '~/api/apis';
import Images from '~/assets';
import { REQUEST_API } from '~/constants/method';
import path from '~/constants/path';
import { RootState } from '~/redux/reducers';
import { Address, User } from '~/types/user.type';
import { toast } from 'react-toastify';
import provinceApi from '~/api/province.apis';
import { City, District, Ward } from '~/types/province.type';

const DetailAcc = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;
  const [user, setUser] = useState<User>();
  const [addresses, setAddress] = React.useState<Address[]>([]);

  const viewDetail = async () => {
    if (!!token) {
      try {
        const url = Api.detailAcc(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setUser(res.data);
          setAddress(res.data.addresses);
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
  React.useEffect(() => {
    viewDetail();
  }, []);

  const [cities, setCities] = React.useState<City[]>([]);
  const [districts, setDistricts] = React.useState<District[]>([]);
  const [wards, setWards] = React.useState<Ward[]>([]);
  const getCities = async () => {
    try {
      const res = await provinceApi.cityApi();

      if (res.status === 200) {
        setCities(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDistricts = async () => {
    if (!!user && user?.addresses.length > 0) {
      try {
        const res = await provinceApi.districtApi(addresses[0]?.province);
        if (res.status === 200) {
          setDistricts(res.data.districts);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const getWards = async () => {
    if (!!user && user?.addresses.length > 0) {
      try {
        const res = await provinceApi.wardApi(addresses[0]?.district);

        if (res.status === 200) {
          setWards(res.data.wards);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    getCities();
  }, []);
  React.useEffect(() => {
    if (!!addresses) {
      getDistricts();
    }
  }, [addresses]);
  React.useEffect(() => {
    if (!!addresses) {
      getWards();
    }
  }, [addresses]);
  let cityName, districtName, wardName;
  if (user && user.addresses && user.addresses.length > 0) {
    cityName = cities.find((city) => city.code === parseInt(addresses[0].province || ''));
    districtName = districts.find((district) => district.code === parseInt(addresses[0].district || ''));
    wardName = wards.find((ward) => ward.code === parseInt(addresses[0].wards || ''));
  }
  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thông tin tài khoản</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Tài khoản : </div>
          <div className="w-[70%] relative flex items-center">{user?.username}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Họ và tên : </div>
          <div className="w-[70%] relative flex items-center justify-between">
            {user?.lastName} {user?.firstName}
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Email : </div>
          <div className="w-[70%] relative flex items-center">{user?.email}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Số điện thoại : </div>
          <div className="w-[70%] relative flex items-center">{user?.phone}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Địa chỉ : </div>
          <div className="w-[70%] relative flex items-center">
            {user?.addresses && user.addresses.length > 0 ? (
              <>
                {addresses[0]?.addressDetail}, {wardName?.name}, {districtName?.name}, {cityName?.name}
              </>
            ) : (
              <>Chưa có địa chỉ</>
            )}
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Ngày tạo : </div>
          <div className="w-[70%] relative flex items-center">{user?.createdDate}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Ngày sửa : </div>
          <div className="w-[70%] relative flex items-center">{user?.modifiedDate}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Quyền : </div>
          <div className="w-[70%] relative flex items-center">{user?.roles[0].name.replace('ROLE_', '')}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Trạng thái : </div>
          {user?.status === 1 && <div className="w-[70%] relative flex items-center text-green-500">Hoạt động</div>}
          {user?.status === 0 && <div className="w-[70%] relative flex items-center text-red-500">Đã khóa</div>}
        </div>
        <div className="flex items-center justify-center mt-3 ml-[70%]">
          <div
            className="w-[30%] flex justify-center items-center bg-blue rounded-md h-10 cursor-pointer"
            onClick={() => navigate(path.accounts)}
          >
            <span>Quay lại</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAcc;
