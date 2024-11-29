import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import { User } from '~/types/user.type';
import provinceApi from '~/api/province.apis';
import { City, District, Ward } from '~/types/province.type';

const ProfileTap = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const userId = useSelector((state: RootState) => state.ReducerAuth.user);

  const [user, setUser] = useState<User>();

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
        const res = await provinceApi.districtApi(user?.addresses[0].province);
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
        const res = await provinceApi.wardApi(user?.addresses[0].district);

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
    if (!!user && user.addresses.length > 0) {
      getDistricts();
    }
  }, [user]);
  React.useEffect(() => {
    if (!!user && user.addresses.length > 0) {
      getWards();
    }
  }, [user]);
  let cityName, districtName, wardName;
  if (user && user.addresses && user.addresses.length > 0) {
    cityName = cities.find((city) => city.code === parseInt(user?.addresses[0].province || ''));
    districtName = districts.find((district) => district.code === parseInt(user?.addresses[0].district || ''));
    wardName = wards.find((ward) => ward.code === parseInt(user?.addresses[0].wards || ''));
  }
  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thông tin tài khoản</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Tài khoản : </div>
          <div className="w-[70%] flex items-center">{user?.username}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Họ và Tên :</div>
          <div className="w-[70%] flex items-center justify-between">
            {user?.lastName} {user?.firstName}
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Email : </div>
          <div className="w-[70%] flex items-center">{user?.email}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Số điện thoại</div>
          <div className="w-[70%] flex items-center">{user?.phone}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Địa chỉ :</div>
          <div className="w-[70%] flex items-center">
            {' '}
            {user?.addresses && user.addresses.length > 0 ? (
              <>
                {user?.addresses[0].addressDetail}, {wardName?.name}, {districtName?.name}, {cityName?.name}
              </>
            ) : (
              <>Chưa có địa chỉ</>
            )}
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Ngày tạo : </div>
          <div className="w-[70%] flex items-center">{user?.createdDate}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Ngày sửa :</div>
          <div className="w-[70%] flex items-center">{user?.modifiedDate}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Quyền :</div>
          <div className="w-[70%] flex items-center">{user?.roles[0].name.replace('ROLE_', '')}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-base text-black font-bold">Trạng thái :</div>
          {user?.status === 1 && <div className="w-[70%] flex items-center text-green-500">Hoạt động</div>}
          {user?.status === 0 && <div className="w-[70%] flex items-center text-red-500">Đã khóa</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileTap;
