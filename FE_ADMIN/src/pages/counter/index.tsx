import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import SpinLoading from '~/components/loading/spinLoading';
import Pagination from '~/components/paginationItems';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import Images from '~/assets';
import { OrderCreate } from '~/types/order.type';
import { Link, useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

const options = [
  { title: 'Chờ Xác Nhận', id: 1 },
  { title: 'Đã Xác Nhận', id: 2 },
  { title: 'Đang Giao', id: 3 },
];

interface Params {
  keyword: string;
  pageNo: number;
  status?: number | undefined;
}

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

const Counter = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const [keyword, setKeyword] = useState('');
  const [isNone, setIsNone] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [loadding, setLoading] = React.useState(false);
  const [order, setOrder] = React.useState<OrderCreate[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [invoiceCode, setInvoiceCode] = React.useState<string>();
  const navigate = useNavigate();

  const getAllInvoices = async () => {
    try {
      const url = Api.getAllInvoices();
      const [res] = await Promise.all([
        REQUEST_API({
          url: url,
          method: 'get',
          token: token,
        }),
      ]);

      if (res.status) {
        const newData = res.data;

        setOrder(newData);
        setIsNone(false);
        console.log(newData);

        if (newData.length == 0) {
          setIsNone(true);
        }
      } else {
        setOrder([]);
        setIsNone(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderByCode = async () => {
    try {
      if (keyword != '') {
        const url = Api.getInvoiceByCode(keyword);
        const res = await REQUEST_API({
          url: url,
          method: 'post',
          token: token,
        });

        if (res.status) {
          const data = res.data;
          setOrder([]);
          setOrder([data]);
          setIsNone(data != null ? false : true);
        }
      } else {
        getAllInvoices();
      }
    } catch (error) {
      console.error(error);
      setIsNone(true);
      return null;
    }
  };

  const openModal = (code: string) => {
    setInvoiceCode(code);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteInvoice = async () => {
    try {
      const url = Api.deleteInvoiceByCode(invoiceCode);
      const [res] = await Promise.all([
        REQUEST_API({
          url: url,
          method: 'delete',
          token: token,
        }),
      ]);

      if (res.status) {
        toast.success('Xóa đơn hàng thành công');
        getAllInvoices();
        setIsOpen(false);
      } else {
        toast.error('Đã xảy ra lỗi trong khi xóa đơn hàng');
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllInvoices();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-base font-bold">Thanh Toán Tại Quầy</span>
          <div className="flex ml-5 items-center justify-center relative">
            <input
              className="h-10 border-black rounded-lg pl-3"
              placeholder="Nhập mã đơn hàng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <i onClick={getOrderByCode} className="bx bx-search text-2xl text-blue ml-3 cursor-pointer"></i>
          </div>
        </div>

        <div className="flex items-center justify-around gap-3">
          <Link
            to={path.createOrder}
            className="px-2 py-1 cursor-pointer flex justify-center items-center bg-blue rounded-md"
          >
            <i className="bx bxs-plus-circle text-2xl text-white"></i>
          </Link>
        </div>
      </div>

      <Modal>1</Modal>

      <div className="w-full h-[2px] bg-black mt-5"></div>
      <div className="overflow-x-auto w-full h-[100vh]">
        {isNone ? (
          <div className="flex flex-col items-center mt-3">
            <span className="text-black text-xl">Không có đơn hàng nào</span>
            <img src={Images.iconNull} className="object-contain w-80 h-80" />
          </div>
        ) : (
          <table className="table w-full">
            <thead className="border-black border-b-[1px]">
              <tr>
                <th className="w-[15%] text-center">Mã đơn hàng</th>
                <th className="w-[20%] text-center">Người mua</th>
                <th className="w-[20%] text-center">Số điện thoại</th>
                <th className="w-[15%] text-center">Thanh toán</th>
                <th className="w-[15%] text-center">Đơn giá</th>
                <th className="w-[10%] text-center">Hành Động</th>
                <th className="w-[5%] text-center"></th>
              </tr>
            </thead>
            <tbody>
              {order.map((order) => {
                return (
                  <tr>
                    <td className="w-[15%] text-center">{order.code}</td>
                    <td className="w-[20%] text-center">{order.fullName}</td>
                    <td className="w-[20%] text-center">{order.phone}</td>
                    <td className="w-[15%] text-center">{order.paymentMethod}</td>
                    <td className="w-[15%] text-center">
                      {order.items.reduce((prev, item) => {
                        return (prev += item.sellPrice);
                      }, 0)}
                    </td>
                    <td className="w-[10%] text-center">
                      <i
                        className="bx bxs-pencil text-2xl font-semibold text-blue pt-2"
                        onClick={() => navigate(path.createOrder, { state: order.code })}
                      ></i>
                    </td>
                    <td className="w-[5%] text-center">
                      <i className="bx bx-trash text-2xl text-red-500" onClick={() => openModal(order.code)}></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
          <div className="w-full flex flex-col items-center justify-center">
            <h2 className="text-red-500">Bạn có chắc chắn muốn xóa đơn hàng này</h2>
            <p className="text-sm text-black">
              Nếu bạn xóa đơn hàng này thì tất cả dữ liệu liên quan đến đơn hàng này đều bị xóa!
            </p>
            <div className="flex items-center justify-around w-full mt-5">
              <div
                className="cursor-pointer w-[30%] h-10 rounded-md bg-blue flex items-center justify-center"
                onClick={closeModal}
              >
                <span>Hủy</span>
              </div>
              <div
                className="cursor-pointer w-[30%] h-10 rounded-md bg-red-500 flex items-center justify-center"
                onClick={deleteInvoice}
              >
                <span>Xóa</span>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <Pagination totalPage={totalPage} page={page} handlePageClick="" />
      {loadding && <SpinLoading />}
    </div>
  );
};

export default Counter;
