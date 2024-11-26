import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import { RootState } from '~/redux/reducers';
import { User } from '~/types/user.type';
import orderApi from '~/apis/order.apis';
import { Order, OrderItem } from '~/types/order.type';
import { formatPrice } from '~/constants/utils';
import { toast } from 'react-toastify';

import './styles.css';
import LeftPage from './component/leftPage';
import userApi from '~/apis/user.apis';
import provinceApi from '~/apis/province.apis';
import { City, District, Ward } from '~/types/province.type';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Profile = () => {
  const user1: User = useSelector((state: RootState) => state.AuthReducer.user);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [user, setUser] = React.useState<User>();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(false);
  const [orderId, setOrderId] = React.useState<number>();

  const openModal = (id: number) => {
    setOrderId(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const getUser = async () => {
    try {
      const res = await userApi.getUser(user1.id);
      if (res.data.status) {
        setUser(res.data.data);
      } else {
        toast.error(`${res.data.data}`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getOrder = async () => {
    try {
      const res = await orderApi.getOrder(user1.id);
      if (res.data.status) {
        setOrders(res.data.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const cancelOrder = async (id: number) => {
    try {
      const data = {
        orderId: id,
        note: '',
      };
      const res = await orderApi.cancelOrder(data);
      if (res.data.status) {
        getOrder();
        setIsOpen(false);
        toast.success(`Hủy đơn hàng thành công`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      } else {
        toast.error(`${res.data.data}`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getOrder();
    getUser();
  }, []);
  const totalCost = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return 0; // Không tìm thấy đơn hàng, tổng tiền là 0
    }
    const itemTotalCost = order.items.reduce((total, item) => {
      const itemCost = item.sellPrice * item.quantity;
      return total + itemCost;
    }, 0);
    const totalCost = itemTotalCost + order.shippingFee;
    return totalCost;
  };
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
    <div className="layout-account">
      <div className="container">
        <div className="wrapbox-content-account">
          <div className="header-page clearfix">
            <h1>Tài khoản của bạn </h1>
          </div>
          <div className="row">
            <LeftPage />
            <div className="col-lg-9 col-md-12 col-12">
              <div className="row wrap_content_account">
                <div className="col-12 wrap_inforAccount" id="customer_sidebar">
                  <p className="title-detail">Thông tin tài khoản</p>
                  <h2 className="name_account">
                    {user?.lastName} {user?.firstName}
                  </h2>
                  <p className="email ">{user?.email}</p>
                  <div className="address ">
                    {user?.addresses && user.addresses.length > 0 ? (
                      <>
                        <p>{user.addresses[0].addressDetail}</p>
                        <p>{wardName?.name}</p>
                        <p>{districtName?.name}</p>
                        <p>{cityName?.name}</p>
                      </>
                    ) : (
                      <p>Chưa có địa chỉ</p>
                    )}

                    <p>{user?.phone}</p>
                    <Link id="view_address" to={path.address}>
                      Xem địa chỉ
                    </Link>
                  </div>
                </div>
                {orders.length === 0 ? (
                  ''
                ) : (
                  <div className="col-12 wrap_orderAccount" id="customer_orders">
                    <div className="customer-table-wrap">
                      <div className="customer_order customer-table-bg">
                        <p className="title-detail">Danh sách đơn hàng mới nhất</p>
                        <div className="table-responsive-overflow">
                          <div className="table-responsive">
                            <table className="table table-customers">
                              <thead>
                                <tr>
                                  <th className="order_number text-center">Mã đơn hàng</th>
                                  <th className="date text-center">Ngày đặt</th>
                                  <th className="total text-right">Thành tiền</th>
                                  <th className="payment_status text-center">Trạng thái thanh toán</th>
                                  <th className="fulfillment_status text-center">Trạng thái đơn hàng</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {!!orders &&
                                  !!orders.length &&
                                  orders.map((item, i) => {
                                    // if (i >= 5) return;
                                    return (
                                      <tr className="odd " key={i}>
                                        <td
                                          className="text-center"
                                          onClick={() => navigate(path.detailOrder, { state: item.id })}
                                        >
                                          <a className="cursor-pointer">#{item.codeOrders}</a>
                                        </td>
                                        <td className="text-center">
                                          <span>{item.orderDate}</span>
                                        </td>
                                        <td className="text-right">
                                          <span className="total money">{formatPrice(totalCost(item.id))}</span>
                                        </td>
                                        <td className="text-center">
                                          <span className="status_pending">
                                            {item.isCheckout ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                          </span>
                                        </td>
                                        <td className="text-center">
                                          <span className="status_not fulfilled">
                                            {item?.status === 1 && 'Chờ xác nhận'}
                                            {item?.status === 2 && 'Đã xác nhận'}
                                            {item?.status === 3 && 'Đang giao'}
                                            {item?.status === 4 && 'Đã giao'}
                                            {item?.status === 0 && 'Đã hủy'}
                                            {item?.status === 5 && 'Từ chối nhận hàng'}
                                          </span>
                                        </td>
                                        <td className="text-center">
                                          {item.status === 1 && (
                                            <div className="cancel-order" onClick={() => openModal(item.id)}>
                                              <span>Hủy</span>
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
        <div className="modal-cancel-order">
          <h2 className="da-huy">Bạn có chắc chắn muốn hủy đơn hàng</h2>
          <div className="action">
            <div className="cursor-pointer huy" onClick={closeModal}>
              <span>Hủy</span>
            </div>
            <div className="cursor-pointer xac-nhan" onClick={() => cancelOrder(orderId)}>
              <span>Xác nhận</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
