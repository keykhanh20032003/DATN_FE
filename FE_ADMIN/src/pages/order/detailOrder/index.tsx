import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import { formatPrice } from '~/constants/utils';
import { Order, OrderItem } from '~/types/order.type';
import Modal from 'react-modal';
import { User } from '~/types/user.type';
import DatePicker from 'react-datepicker';
import { formatDate } from '~/constants/formatDate';
import provinceApi from '~/api/province.apis';
import { City, District, Ward } from '~/types/province.type';
import LoadingPage from '~/components/loadingPage';

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

const ModalCus = ({ isOpen, closeModal, title, content, onClick, shipDate, onChange, status }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div className="flex flex-col items-center justify-around h-[200px] w-[800px] rounded-lg">
        <h1 className="text-red-500 text-xl font-bold">{title}</h1>
        <p className="text-base text-black">{content}</p>
        {status === 3 && (
          <div className="flex items-center justify-center py-3">
            <span>Chọn ngày giao hàng</span>
            <DatePicker
              selected={shipDate}
              onChange={onChange}
              timeInputLabel="Time:"
              dateFormat="dd/MM/yyyy h:mm:ss aa"
              showTimeInput
              placeholderText="Nhập ngày giao thành công"
              className="rounded-lg h-9 pl-2 border-[#737373] w-[100%] ml-4"
            />
          </div>
        )}
        <div className="flex items-center justify-around w-full mt-5">
          <div
            className="cursor-pointer w-[40%] h-10 rounded-md flex items-center justify-center bg-blue"
            onClick={onClick}
          >
            <span className="text-base">Xác nhận</span>
          </div>
          <div
            className="cursor-pointer w-[30%] h-10 rounded-md bg-red-500 flex items-center justify-center"
            onClick={closeModal}
          >
            <span className="text-base">Hủy</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const DetailOrder = () => {
  const location = useLocation();
  const id = location.state;
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const [order, setOrder] = React.useState<Order>();
  const [user2, setUser2] = React.useState<User>();
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpen2, setIsOpen2] = React.useState(false);
  const [shipDate, setShipDate] = React.useState(new Date());
  const [isLoading, setIsLoading] = React.useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const openModal2 = () => {
    setIsOpen2(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setIsOpen2(false);
  };
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
          setOrderItems(res.data.items);
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
  const getUser = async () => {
    if (!!token) {
      try {
        const url = Api.detailAcc(order?.user);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setUser2(res.data);
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
    if (order != null) {
      getUser();
    }
  }, [order]);
  const totalCost =
    orderItems.reduce((total, item) => {
      const itemCost = item.sellPrice * item.quantity;
      return total + itemCost;
    }, 0) + order?.shippingFee;

  const handleConfirm = async () => {
    if (!!token) {
      try {
        const data = {
          orderId: id,
          userNameEmp: user.username,
        };
        const url = Api.confirmOrder();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);

        if (res.status) {
          getOrder();
          setIsOpen(false);
          toast.success(`Đơn hàng đã được xác nhận`, {
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
  const handleShipping = async () => {
    if (!!token) {
      try {
        setIsLoading(true);
        const data = {
          orderId: id,
          userNameEmp: user.username,
        };
        const url = Api.shippingOrder();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);

        if (res.status) {
          setIsLoading(false);
          getOrder();
          setIsOpen(false);
          toast.success(`Đơn hàng đã được chuẩn bị giao đi`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
          setIsLoading(false);

          toast.error(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        setIsLoading(true);

        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleSuccess = async () => {
    if (!!token) {
      try {
        if (!shipDate) {
          toast.success(`Hãy chọn ngày giao thành công`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        setIsLoading(true);
        const data = {
          orderId: id,
          userNameEmp: user.username,
          shipDate: formatDate(shipDate),
        };
        const url = Api.successOrder();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);

        if (res.status) {
          setIsLoading(false);

          getOrder();
          setIsOpen(false);
          toast.success(`Đơn hàng đã được xác nhận giao thành công`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
          setIsLoading(false);

          toast.error(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        setIsLoading(true);

        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleCancel = async () => {
    if (!!token) {
      try {
        const data = {
          orderId: id,
          userNameEmp: user.username,
        };
        const url = Api.cancelOrder();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);

        if (res.status) {
          getOrder();
          setIsOpen(false);
          toast.success(`Đơn hàng đã được xác nhận giao không thành công`, {
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
  const handleAction = async () => {
    try {
      setIsLoading(true);
      if (order?.status === 1) {
        await handleConfirm();
      } else if (order?.status === 2) {
        await handleShipping();
      } else if (order?.status === 3) {
        await handleSuccess();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
    try {
      const res = await provinceApi.districtApi(order?.province);
      if (res.status === 200) {
        setDistricts(res.data.districts);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getWards = async () => {
    try {
      const res = await provinceApi.wardApi(order?.district);

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
  React.useEffect(() => {
    if (!!order) {
      getDistricts();
    }
  }, [order]);
  React.useEffect(() => {
    if (!!order) {
      getWards();
    }
  }, [order]);
  const cityName = cities.find((city) => city.code === parseInt(order?.province || ''));
  const districtName = districts.find((district) => district.code === parseInt(order?.district || ''));
  const wardName = wards.find((ward) => ward.code === parseInt(order?.wards || ''));
  return (
    <>
      {isLoading && <LoadingPage />}
      <div className="flex mt-0">
        <div className="flex flex-col border rounded-md p-5 w-[70%]">
          <span className="text-lg font-semibold text-blue">Thông tin đơn hàng</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Mã đơn hàng: </span>
            <span className="text-base ml-5">{order?.codeOrders}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Người nhận: </span>
            <span className="text-base ml-5">{order?.fullName}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Số điện thoại: </span>
            <span className="text-base ml-5">{order?.phone}</span>
          </div>
          <div className="flex pt-5">
            <span className="text-base text-black font-bold w-[20%]">Địa chỉ: </span>
            <span className="text-base ml-5">
              {order?.addressDetail}, {wardName?.name}, {districtName?.name}, {cityName?.name}
            </span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Note: </span>
            <span className="text-base ml-5">{order?.note}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Thanh toán: </span>
            <span className="text-base ml-5">{order?.isCheckout ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Phương thức thanh toán: </span>
            <span className="text-base ml-5">{order?.paymentMethod}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tài khoản đặt hàng: </span>
            <span className="text-base ml-5">{user2?.username}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày giao hàng: </span>
            <span className="text-base ml-5">{order?.shipDate ? `${order.shipDate}` : 'Chưa cập nhật'}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày tạo: </span>
            <span className="text-base ml-5">{order?.createDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày sửa đổi gần nhất: </span>
            <span className="text-base ml-5">{order?.modifiedDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Nhân viên chăm sóc: </span>
            <span className="text-base ml-5">{order?.userNameEmp}</span>
          </div>
          <span className="text-lg font-semibold text-blue pt-3">Trạng thái đơn hàng</span>
          <div className="w-full h-[1px] bg-black my-1"></div>
          <div className="flex items-center pt-3">
            {order?.status === 1 && <span className="text-base font-bold text-orange-500">Chờ xác nhận</span>}
            {order?.status === 2 && <span className="text-base font-bold text-green-500">Đã xác nhận</span>}
            {order?.status === 3 && <span className="text-base font-bold text-cyan-500">Đang giao</span>}
            {order?.status === 4 && <span className="text-base font-bold text-blue">Đã giao</span>}
            {order?.status === 0 && <span className="text-base font-bold text-red-500">Đã hủy</span>}
            {order?.status === 5 && <span className="text-base font-bold text-red-500">Khách không nhận hàng</span>}
            {order?.status === 1 && (
              <i
                className="bx bxs-edit text-2xl font-semibold text-blue ml-10 cursor-pointer"
                onClick={() => openModal()}
              ></i>
            )}
            {order?.status === 2 && (
              <i
                className="bx bxs-edit text-2xl font-semibold text-blue ml-10 cursor-pointer"
                onClick={() => openModal()}
              ></i>
            )}
            {order?.status === 3 && (
              <i
                className="bx bxs-edit text-2xl font-semibold text-blue ml-10 cursor-pointer"
                onClick={() => openModal()}
              ></i>
            )}
            {order?.status === 1 && order.isCheckout === false && (
              <i
                className="bx bxs-x-square text-2xl font-semibold text-red-500 ml-10 cursor-pointer"
                onClick={() => openModal2()}
              ></i>
            )}
            {order?.status === 2 && order.isCheckout === false && (
              <i
                className="bx bxs-x-square text-2xl font-semibold text-red-500 ml-10 cursor-pointer"
                onClick={() => openModal2()}
              ></i>
            )}
            {order?.status === 3 && order.isCheckout === false && (
              <i
                className="bx bxs-x-square text-2xl font-semibold text-red-500 ml-10 cursor-pointer"
                onClick={() => openModal2()}
              ></i>
            )}
          </div>
        </div>
        <div className="flex flex-col border rounded-md p-5 ml-10 w-full">
          <div className="flex mb-3">
            <span className="text-lg font-semibold text-blue">Danh sách sản phẩm</span>
          </div>
          <div className="w-full h-[1px] bg-black"></div>
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-[30%] text-center text-black">Tên sản phẩm</th>
                <th className="w-[10%] text-center text-black">Màu</th>
                <th className="w-[10%] text-center text-black">Size</th>
                <th className="w-[15%] text-center text-black">Số lượng</th>
                <th className="w-[15%] text-center text-black">Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {!!orderItems &&
                !!orderItems.length &&
                orderItems.map((item, i) => {
                  return (
                    <tr key={i} className="cursor-pointer">
                      <td className="text-center">{item.productName}</td>
                      <td className="text-center">{item.valueColor}</td>
                      <td className="text-center">{item.valueSize}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{formatPrice(item.sellPrice)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="w-full h-[1px] bg-black my-2"></div>
          <div className="flex flex-col self-end">
            <div className="flex items-center">
              <span className="text-base text-black font-bold">Phí ship: </span>
              <span className="text-base ml-5">{formatPrice(order?.shippingFee)}</span>
            </div>
            <div className="flex items-center pt-5">
              <span className="text-base text-black font-bold">Tổng tiền của đơn hàng: </span>
              <span className="text-base ml-5">{formatPrice(totalCost)}</span>
            </div>
          </div>
          <div
            className="flex items-center justify-center bg-blue h-10 rounded-md w-[30%] self-end mt-[60%] cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <span className="text-black font-bold">Quay lại</span>
          </div>
        </div>
      </div>
      <ModalCus
        status={order?.status}
        shipDate={shipDate}
        onChange={(date) => setShipDate(date)}
        isOpen={isOpen}
        title={
          order?.status === 1
            ? 'Xác nhận đơn hàng'
            : order?.status === 2
            ? 'Vận chuyển đơn hàng'
            : order?.status === 3
            ? 'Đơn hàng giao thành công'
            : ''
        }
        content={
          order?.status === 1
            ? 'Bạn có chắc chắn xác nhận đơn hàng này?'
            : order?.status === 2
            ? 'Bạn có chắc chắn vận chuyển đơn hàng này?'
            : order?.status === 3
            ? 'Bạn có chắc chắn đơn hàng này giao thành công? Vui lòng chọn ngày giao thành công'
            : ''
        }
        closeModal={closeModal}
        onClick={handleAction}
      />
      <ModalCus
        isOpen={isOpen2}
        title={'Hủy đơn hàng'}
        content={'Bạn có chắc chắn hủy đơn hàng này?'}
        closeModal={closeModal}
        onClick={handleCancel}
      />
    </>
  );
};

export default DetailOrder;
