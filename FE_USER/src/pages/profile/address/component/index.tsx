import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import provinceApi from '~/apis/province.apis';
import userApi from '~/apis/user.apis';
import { RootState } from '~/redux/reducers';
import { Address } from '~/types/address.type';
import { City, District, Ward } from '~/types/province.type';
import { User } from '~/types/user.type';

interface IInput {
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}
const Input = ({ placeholder, value, onChange }: IInput) => {
  return (
    <div className="input-group">
      <input
        type="text"
        className="input-textbox textbox"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
const ViewEdit = ({ onCancel, mode, setIsAction, addressId, getAddress, addressData }) => {
  const user: User = useSelector((state: RootState) => state.AuthReducer.user);
  const isAddNew = mode === 'add';
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [cities, setCities] = React.useState<City[]>([]);
  const [districts, setDistricts] = React.useState<District[]>([]);
  const [wards, setWards] = React.useState<Ward[]>([]);
  const [cityId, setCityId] = React.useState('');
  const [districtId, setDistrictId] = React.useState('');
  const [wardId, setWardId] = React.useState('');
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

  const handleCreateAddress = async () => {
    try {
      const phoneNumberRegex = /^0[0-9]{9}$/;
      if (!lastName) {
        toast.error(`Vui lòng nhập họ`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!firstName) {
        toast.error(`Vui lòng nhập tên`, {
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
      if (!address) {
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
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        addressDetail: address,
        province: cityId,
        district: districtId,
        wards: wardId,
        userId: user.id,
      };
      const res = await userApi.createAddress(data);
      if (res.data.status) {
        setIsAction(false);
        getAddress();
        toast.success(`Thêm mới địa chỉ thành công`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      } else {
        toast.error(`Thêm mới địa chỉ thất bại`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateAddress = async () => {
    try {
      const phoneNumberRegex = /^0[0-9]{9}$/;
      if (!lastName) {
        toast.error(`Vui lòng nhập họ`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!firstName) {
        toast.error(`Vui lòng nhập tên`, {
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
      if (!address) {
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
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        addressDetail: address,
        province: cityId,
        district: districtId,
        wards: wardId,
        userId: user.id,
      };
      const res = await userApi.updateAddress(addressId, data);
      if (res.data.status) {
        setIsAction(false);
        getAddress();
        toast.success(`Thay đổi địa chỉ thành công`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      } else {
        toast.error(`Thay đổi địa chỉ thất bại`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAction = () => {
    if (isAddNew) {
      handleCreateAddress();
    } else {
      handleUpdateAddress();
    }
  };
  React.useEffect(() => {
    if (addressId) {
      const selectedAddress: Address = addressData.find((item) => item.id === addressId);
      if (selectedAddress) {
        setFirstName(selectedAddress.firstName);
        setLastName(selectedAddress.lastName);
        setPhone(selectedAddress.phone);
        setAddress(selectedAddress.addressDetail);
        setCityId(selectedAddress.province);
        setWardId(selectedAddress.wards);
        setDistrictId(selectedAddress.district);
      }
    }
  }, [addressId, addressData]);
  return (
    <div className={`customer_address ${isAddNew && 'add_address add_address_table'}`}>
      <Input placeholder="Họ" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <Input placeholder="Tên" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <Input placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
      <div className="input-group">
        <select name="" id="" className="input-textbox textbox" onChange={handleCity} value={cityId}>
          <option value="">Chọn tỉnh / thành</option>
          {!!cities &&
            !!cities.length &&
            cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
        </select>
      </div>
      <div className="input-group">
        <select name="" id="" className="input-textbox textbox" onChange={handleDistrict} value={districtId}>
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
      <div className="input-group">
        <select name="" id="" className="input-textbox textbox" onChange={handleWard} value={wardId}>
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
      <div className="action_bottom">
        <div className="btn" onClick={handleAction}>
          <span>{isAddNew ? 'Thêm mới' : 'Cập nhật'}</span>
        </div>
        <span className="">
          hoặc{' '}
          <Link to="#" onClick={onCancel}>
            Hủy
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ViewEdit;
