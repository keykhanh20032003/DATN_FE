import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import provinceApi from '~/api/province.apis';
import { REQUEST_API } from '~/constants/method';
import { toast } from 'react-toastify';
import { RootState } from '~/redux/reducers';
import { City, District, Ward } from '~/types/province.type';
import { useLocation } from 'react-router-dom';
import { Order, OrderItem } from '~/types/order.type';

const EditOrder = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const location = useLocation();
  const id = location.state;

  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [note, setNote] = React.useState('');
  const [addressDetail, setAddressDetail] = React.useState('');
  const [cities, setCities] = React.useState<City[]>([]);
  const [districts, setDistricts] = React.useState<District[]>([]);
  const [wards, setWards] = React.useState<Ward[]>([]);
  const [cityId, setCityId] = React.useState('');
  const [districtId, setDistrictId] = React.useState('');
  const [wardId, setWardId] = React.useState('');

  const [order, setOrder] = React.useState<Order>();

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
    try {
      const res = await provinceApi.districtApi(cityId);
      if (res.status === 200) {
        setDistricts(res.data.districts);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getWards = async () => {
    try {
      const res = await provinceApi.wardApi(districtId);

      if (res.status === 200) {
        setWards(res.data.wards);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getCities();
  }, []);
  const handleCity = (e) => {
    const city = e.target.value;
    if (city === 'Chọn tỉnh / thành') {
      setCityId('');
      setDistrictId('');
      setWardId('');
      setWards([]);
      setDistricts([]);
    } else {
      setCityId(city);
      setDistrictId('');
      setWardId('');
      setWards([]);
    }
  };
  const handleDistrict = (e) => {
    const district = e.target.value;
    if (district === 'Chọn quận / huyện') {
      setDistrictId('');
      setWardId('');
      setWards([]);
    } else {
      setDistrictId(district);
      setWardId('');
    }
  };
  const handleWard = (e) => {
    const ward = e.target.value;
    if (ward === 'Chọn phường / xã') {
      setWardId('');
    } else {
      setWardId(ward);
    }
  };
  React.useEffect(() => {
    if (cityId) {
      getDistricts();
    }
  }, [cityId]);
  React.useEffect(() => {
    if (districtId) {
      getWards();
    }
  }, [districtId]);
  const getOrder = async () => {
    if (!!token) {
      try {
        const url = Api.getOrder(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setOrder(res.data);
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
    getOrder();
  }, []);
  React.useEffect(() => {
    if (!!order) {
      setFullName(order.fullName);
      setPhone(order.phone);
      setNote(order.note || '');
      setAddressDetail(order.addressDetail);
      setWardId(order.wards);
      setDistrictId(order.district);
      setCityId(order.province);
    }
  }, [order]);
  const updateOrder = async () => {
    if (!!token) {
      try {
        const phoneNumberRegex = /^0[0-9]{9}$/;
        if (!fullName) {
          toast.error(`Vui lòng nhập họ tên`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        if (!phone) {
          toast.error(`Vui lòng nhập số điện thoại`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        if (!addressDetail) {
          toast.error(`Vui lòng nhập địa chỉ`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        if (!cityId) {
          toast.error(`Vui lòng chọn tỉnh / thành phố`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        if (!districtId) {
          toast.error(`Vui lòng chọn quận / huyện`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        if (!wardId) {
          toast.error(`Vui lòng chọn phường / xã`, {
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
        const data = {
          orderId: id,
          userNameEmp: order?.userNameEmp,
          fullName: fullName,
          phone: phone,
          note: note,
          addressDetail: addressDetail,
          province: cityId,
          district: districtId,
          wards: wardId,
        };
        const url = Api.upadteOrder();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);
        if (res.status) {
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
        console.error(error);
      }
    }
  };

  return (
    <div className="flex items-center justify-normal">
      <div className="flex flex-col border rounded-md p-5 w-[70%]">
        <span className="text-lg font-semibold text-blue">Thông tin đơn hàng</span>
        <div className="w-full h-[1px] bg-black"></div>
        <div className="flex flex-col pt-5">
          <span className="text-base text-black font-bold">Họ và tên người nhận: </span>
          <input
            value={fullName}
            placeholder="Họ và tên người nhận"
            className="border-[2px] rounded-md pl-3 border-black h-10"
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="flex flex-col pt-5">
          <span className="text-base text-black font-bold">Số điện thoại: </span>
          <input
            value={phone}
            placeholder="Số điện thoại người nhận"
            className="border-[2px] rounded-md pl-3 border-black h-10"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col pt-5">
          <span className="text-base text-black font-bold">Note: </span>
          <input
            value={note}
            placeholder="Note"
            className="border-[2px] rounded-md pl-3 border-black h-10"
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex flex-col pt-5">
          <span className="text-base text-black font-bold">Chi tiết địa chỉ: </span>
          <input
            value={addressDetail}
            placeholder="Địa chỉ chi tiết"
            className="border-[2px] rounded-md pl-3 border-black h-10"
            onChange={(e) => setAddressDetail(e.target.value)}
          />
        </div>
        <div className="flex flex-col pt-5">
          <span className="text-base text-black font-bold">Tỉnh / Thành: </span>
          <select
            className="appearance-none border-[2px] rounded-md pl-3 border-black h-10"
            onChange={handleCity}
            value={cityId}
          >
            <option>Chọn tỉnh / thành</option>
            {!!cities &&
              !!cities.length &&
              cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col pt-5">
          <span className="text-base text-black font-bold">Quận / Huyện: </span>
          <select
            className="appearance-none border-[2px] rounded-md pl-3 border-black h-10"
            onChange={handleDistrict}
            value={districtId}
          >
            <option>Chọn quận / huyện</option>
            {!!districts &&
              !!districts.length &&
              districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col pt-5">
          <span className="text-base text-black font-bold">Phường / Xã: </span>
          <select
            className="appearance-none border-[2px] rounded-md pl-3 border-black h-10"
            onChange={handleWard}
            value={wardId}
          >
            <option>Chọn phường / xã</option>
            {!!wards &&
              !!wards.length &&
              wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div
        className="cursor-pointer flex justify-center items-center bg-blue w-[20%] h-10 rounded-md self-end ml-10"
        onClick={updateOrder}
      >
        <span>Cập nhật</span>
      </div>
    </div>
  );
};

export default EditOrder;
