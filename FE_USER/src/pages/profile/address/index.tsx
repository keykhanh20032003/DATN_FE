import React from 'react';
import LeftPage from '../component/leftPage';
import ViewEdit from './component';
import userApi from '~/apis/user.apis';
import { User } from '~/types/user.type';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/reducers';
import { Address } from '~/types/address.type';
import provinceApi from '~/apis/province.apis';
import { toast } from 'react-toastify';

const Address = () => {
  const user: User = useSelector((state: RootState) => state.AuthReducer.user);
  const [isAddNew, setIsAddNew] = React.useState(false);
  const [address, setAddress] = React.useState<Address[]>([]);
  const [addressId, setAddressId] = React.useState();
  const [isEdit, setIsEdit] = React.useState(Array(address.length).fill(false));
  const [cityMap, setCityMap] = React.useState({});
  const [wardMap, setWardMap] = React.useState({});
  const [districtMap, setDistrictMap] = React.useState({});
  const handleEditClick = (index, id) => {
    const newIsEditList = [...isEdit];
    newIsEditList[index] = !newIsEditList[index];
    setIsEdit(newIsEditList);
    setAddressId(id);
  };

  const getCities = async () => {
    try {
      const res = await provinceApi.cityApi();
      if (res.status === 200) {
        const newCity = res.data.map((city) => ({
          code: city.code,
          name: city.name,
        }));
        newCity.forEach((city) => {
          setCityMap((prevMapping) => ({
            ...prevMapping,
            [city.code]: city.name,
          }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDistricts = async (id) => {
    try {
      const res = await provinceApi.districtApi(id);
      if (res.status === 200) {
        const newDistrict = res.data.districts.map((district) => ({
          code: district.code,
          name: district.name,
        }));
        newDistrict.forEach((district) => {
          setDistrictMap((prevMapping) => ({
            ...prevMapping,
            [district.code]: district.name,
          }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getWards = async (id) => {
    try {
      const res = await provinceApi.wardApi(id);

      if (res.status === 200) {
        const newWards = res.data.wards.map((ward) => ({
          code: ward.code,
          name: ward.name,
        }));
        newWards.forEach((ward) => {
          setWardMap((prevMapping) => ({
            ...prevMapping,
            [ward.code]: ward.name,
          }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getCities();
  }, []);
  React.useEffect(() => {
    if (address.length > 0) {
      address.forEach(async (item) => {
        if (item.district !== null && item.district !== undefined && !Number.isNaN(item.district)) {
          await getWards(parseInt(item.district));
        }
      });
    }
  }, [address]);
  React.useEffect(() => {
    if (address.length > 0) {
      address.forEach(async (item) => {
        if (item.province !== null && item.province !== undefined && !Number.isNaN(item.province)) {
          await getDistricts(parseInt(item.province));
        }
      });
    }
  }, [address]);
  const getAddress = async () => {
    try {
      const res = await userApi.getAddress(user.id);
      if (res.data.status) {
        setAddress(res.data.data);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAddress();
  }, []);
  const deleteAddress = async (id: number) => {
    try {
      const res = await userApi.deleteAddress(id);
      if (res.data.status) {
        getAddress();
        toast.success(`Xóa địa chỉ thành công`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      } else {
        toast.error(`Xóa địa chỉ không thành công`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="layout-account">
      <div className="container">
        <div className="wrapbox-content-account">
          <div className="header-page clearfix">
            <h1>Thông tin địa chỉ</h1>
          </div>
          <div className="row">
            <LeftPage />
            {/* view_address */}
            <div className="col-lg-9 col-md-12 col-12">
              <div className="row wrap_content_address">
                <div className="col-lg-6 col-md-12 col-12 wrap_editAddress">
                  <div id="address_tables">
                    {!!address &&
                      !!address.length &&
                      address.map((item, i) => (
                        <React.Fragment key={i}>
                          <div className="row">
                            <div className="col-lg-12 col-xs-12 clearfix">
                              <div className="address_title ">
                                <h3>
                                  <strong>
                                    {item.lastName} {item.firstName}
                                  </strong>
                                  {item.focus === 1 && <span className="default_address note">(Địa chỉ mặc định)</span>}
                                </h3>
                                <p className="address_actions text-right">
                                  <span className="action_link action_edit" onClick={() => handleEditClick(i, item.id)}>
                                    <a href="#">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={18}
                                        height={18}
                                        x={0}
                                        y={0}
                                        viewBox="0 0 512 512"
                                      >
                                        <g>
                                          <path
                                            id="Edit"
                                            d="m192 256v48c0 8.836 7.156 16 16 16h48c4.281 0 8.391-1.719 11.406-4.781l166.531-169.273c9.063-9.071 14.063-21.126 14.063-33.946s-5-24.875-14.063-33.937c-18.734-18.719-49.172-18.719-67.781-.094l-169.375 166.625c-3.062 3.008-4.781 7.117-4.781 11.406zm32 6.703 164.688-162.016c6.25-6.234 16.375-6.242 22.625.008 3.031 3.016 4.687 7.032 4.687 11.305s-1.656 8.289-4.781 11.406l-161.922 164.594h-25.297zm224-22.703v128c0 44.109-35.891 80-80 80h-224c-44.109 0-80-35.891-80-80v-224c0-44.109 35.891-80 80-80h128c8.844 0 16 7.164 16 16s-7.156 16-16 16h-128c-26.469 0-48 21.531-48 48v224c0 26.469 21.531 48 48 48h224c26.469 0 48-21.531 48-48v-128c0-8.836 7.156-16 16-16s16 7.164 16 16z"
                                            fill="#000000"
                                            data-original="#000000"
                                          />
                                        </g>
                                      </svg>
                                    </a>
                                  </span>
                                  <span className="action_link action_delete" onClick={() => deleteAddress(item.id)}>
                                    <a href="#">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={18}
                                        height={18}
                                        x={0}
                                        y={0}
                                        viewBox="0 0 24 24"
                                      >
                                        <g>
                                          <path
                                            clipRule="evenodd"
                                            d="m5.00073 17.5864c-.3905.3906-.39044 1.0237.00012 1.4142s1.02372.3905 1.41421-.0001l5.58524-5.5862 5.5857 5.5857c.3905.3905 1.0237.3905 1.4142 0s.3905-1.0237 0-1.4142l-5.5858-5.5858 5.5854-5.58638c.3904-.39056.3904-1.02372-.0002-1.41421-.3905-.3905-1.0237-.39044-1.4142.00012l-5.5853 5.58627-5.58572-5.58579c-.39052-.39052-1.02369-.39052-1.41421 0-.39053.39053-.39053 1.02369 0 1.41422l5.58593 5.58587z"
                                            fill="#000000"
                                            fillRule="evenodd"
                                            data-original="#000000"
                                          />
                                        </g>
                                      </svg>
                                    </a>
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="address_table">
                            {isEdit[i] !== true && (
                              <div className="customer_address">
                                <div className="view_address row">
                                  <div className="col-lg-12 col-md-12 large_view">
                                    <p>
                                      <strong>
                                        {item.lastName} {item.firstName}
                                      </strong>
                                    </p>
                                  </div>
                                  <div className="col-lg-12 col-md-12 large_view"></div>
                                  <div className="col-lg-12 col-md-12 large_view">
                                    <div className="lb-left">
                                      <b>Địa chỉ:</b>
                                    </div>
                                    <div className="lb-right">
                                      <p>{item.addressDetail}</p>
                                      <p>{wardMap[item.wards]}</p>
                                      <p>
                                        {districtMap[item.district]}, {cityMap[item.province]}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 large_view">
                                    <div className="lb-left">
                                      <b>Số điện thoại:</b>
                                    </div>
                                    <div className="lb-right">{item.phone}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {isEdit[i] && (
                              <ViewEdit
                                addressData={address}
                                addressId={addressId}
                                mode=""
                                onCancel={() => handleEditClick(i, item.id)}
                                setIsAction={setIsEdit}
                                getAddress={getAddress}
                              />
                            )}
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-12 wrap_addAddress">
                  <div className="add-new-address" onClick={() => setIsAddNew(!isAddNew)}>
                    Nhập địa chỉ mới
                  </div>
                  {isAddNew && (
                    <ViewEdit
                      addressId=""
                      mode="add"
                      onCancel={() => setIsAddNew(false)}
                      setIsAction={setIsAddNew}
                      getAddress={getAddress}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
