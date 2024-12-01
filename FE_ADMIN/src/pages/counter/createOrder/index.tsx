import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import { API_URL_IMAGE, formatPrice, getRandomNumber } from '~/constants/utils';
import { Order, OrderCreate, OrderItem, OrderItemCreate } from '~/types/order.type';
import Modal from 'react-modal';
import LoadingPage from '~/components/loadingPage';
import { ColorCreate, Product } from '~/types/product.type';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { MenuItem, Select, TextField } from '@mui/material';
import { log } from 'node:console';

const customStyles = {
  content: {
    width: '50%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

interface Params {
  keyword: string;
  status?: number | undefined;
}

interface Params {
  keyword: string;
  status?: number | undefined;
}

const ModalCus = ({ isOpen, closeModal, title, content, onClick }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div className="flex flex-col items-center justify-around h-[200px] w-[800px] rounded-lg">
        <h1 className="text-red-500 text-xl font-bold">{title}</h1>
        <p className="text-base text-black">{content}</p>
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

const CreateOrder = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const [order, setOrder] = React.useState<OrderCreate>();
  const [orderItems, setOrderItems] = React.useState<OrderItemCreate[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [product, setProduct] = React.useState<Product[]>([]);
  const [value, setValue] = React.useState('1');
  const [color, setColor] = React.useState<ColorCreate[]>([]);
  const [fullname, setFullname] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [note, setNote] = React.useState('');
  const [payment, setPayment] = React.useState('Tại Quầy');
  const [expireTime, setExpireTime] = React.useState(0)
  const location = useLocation();
  const [code, setCode] = React.useState(location.state);
  const [isUpdate, setIsUpdate] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const openModal = () => {
    if (validate()) {
      setIsOpen(true);
    }
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const searchProduct = async () => {
    try {
      const params: Params = {
        keyword: keyword,
      };

      const url = Api.getAllProduct(params);
      const [res] = await Promise.all([
        REQUEST_API({
          url: url,
          method: 'get',
          token: token,
        }),
      ]);

      if (res.status) {
        const newData = res.data.data?.map((item) => {
          return {
            ...item,
          };
        });
        setProduct(newData);
      } else {
        setProduct([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validate = () => {
    let flag = true;

    if (orderItems.length == 0) {
      flag = false;
      toast.error('Phải chọn ít nhất một sản phẩm');
    }

    if (fullname == '') {
      flag = false;

      toast.error('Họ tên không được để trống');
    }

    if (phone == '') {
      flag = false;

      toast.error('Số điện thoại không được để trống');
    }

    const notValidItem = orderItems.find((item) => {
      return item.valueColor == '' || item.valueSize === '';
    });

    if (notValidItem) {
      flag = false;
      toast.error('Vui lòng kiểm tra thông tin color và size các sản phẩm');
    }

    return flag;
  };

  const handleAddOrderItem = async (product) => {
    try {
      let color = await getColorByProduct(product.id);

      const newItem: OrderItemCreate = {
        id: product.id,
        productName: product.name,
        quantity: 1,
        sellPrice: product.price,
        valueColor: '',
        valueSize: '',
        color: color,
        maxQuantity: 1,
      };

      setOrderItems([...orderItems, newItem]);
    } catch (error) {
      console.error(error);
    }
  };

  const getColorByProduct = async (id) => {
    try {
      const url = Api.getColorByProductId(id);
      const res = await REQUEST_API({
        url: url,
        method: 'get',
        token: token,
      });

      if (res.status) {
        return res.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const hanldeSelectColor = (index, color) => {
    const value = orderItems.map((item, slot) => {
      if (slot == index) {
        item.valueColor = color;
      }

      return item;
    });

    setOrderItems(value);
  };

  const handleSelectSize = (index, size, item) => {
    const isExist = orderItems.find((elm) => {
      return elm.id == item.id && elm.valueColor == item.valueColor && elm.valueSize == size;
    });

    const total = item.color
      ?.find((color) => {
        return color.value == item.valueColor;
      })
      ?.sizes.find((s) => {
        return s.value == size;
      }).total;

    const value = orderItems.map((item, slot) => {
      if (slot == index && !isExist) {
        item.valueSize = size;
        item.maxQuantity = total;
        item.quantity = 1;
      }

      return item;
    });

    if (isExist) {
      toast.warning('Không được tồn tại 2 sản phẩm giống nhau về thông số');
    }
    setOrderItems(value);
  };

  const handleChangeQuantity = (index, quantity) => {
    const value = orderItems.map((item, slot) => {
      if (slot == index) {
        item.quantity = Number.parseInt(quantity);
      }
      return item;
    }, 0);

    setOrderItems(value);
  };

  const removeItemsFromOrder = (index) => {
    const items = [...orderItems];
    items.splice(index, 1);
    setOrderItems(items);
  };

  const saveOrderInQueue = async () => {
    try {
      if (validate()) {
        const data: OrderCreate = {
          code: code,
          fullName: fullname,
          phone: phone,
          note: note,
          addressDetail: '',
          district: '',
          items: orderItems,
          paymentMethod: payment,
          province: '',
          expireTime: 0,
          wards: '',
        };

        const url = Api.createInvoice();
        const res = await REQUEST_API({
          url: url,
          method: 'post',
          token: token,
          data: data,
        });

        if (res.status) {
          toast.success('Đã thêm đơn hàng vào hàng chờ');
          navigate(-1);
        } else {
          toast.error('Thêm đơn hàng vào hàng chờ thất bại');
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getOrderByCode = async () => {
    try {
      const url = Api.getInvoiceByCode(code);
      const res = await REQUEST_API({
        url: url,
        method: 'post',
        token: token,
      });

      if (res.status) {
        const data = res.data;

        setFullname(data?.fullName);
        setPhone(data?.phone);
        setNote(data?.note);
        setExpireTime(data?.expireTime);
        const items = data?.items;
        const orderItems = await Promise.all(
          items.map(async (item) => {
            let color = await getColorByProduct(item.id);
            const newItem: OrderItemCreate = {
              id: item.id,
              productName: item.productName,
              quantity: item.quantity,
              sellPrice: item.sellPrice,
              valueColor: item.valueColor,
              valueSize: item.valueSize,
              color: color,
              maxQuantity: item.maxQuantity,
            };

            return newItem;
          }),
        );

        setOrderItems(orderItems);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const printBill = async () => {
    try {
      const data: OrderCreate = {
        code: code || '',
        fullName: fullname,
        phone: phone,
        note: note,
        addressDetail: '',
        district: '',
        items: orderItems,
        paymentMethod: payment,
        province: '',
        expireTime: 0,
        wards: '',
      };

      const url = Api.printBill();
      const res = await REQUEST_API({
        url: url,
        method: 'post',
        token: token,
        data: data,
      });

      if (res.status) {
      } else {
        toast.error('Thêm đơn hàng vào hàng chờ thất bại');
      }

      const base64Pdf = res.data;
      console.log(base64Pdf);

      const pdfWindow = window.open();
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width="100%" height="100%" src="data:application/pdf;base64,${base64Pdf}"></iframe>`,
        );
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const payInvoice = async () => {
    try {
      const data: OrderCreate = {
        code: code,
        fullName: fullname,
        phone: phone,
        note: note,
        addressDetail: '',
        district: '',
        items: orderItems,
        paymentMethod: payment,
        province: '',
        expireTime: 0,
        wards: '',
      };

      const url = Api.payInvoice();
      const res = await REQUEST_API({
        url: url,
        method: 'post',
        token: token,
        data: data,
      });

      if (res.status) {
        toast.success('Thanh toán đơn hàng thành công');
        navigate(-1);
      } else {
        toast.error('Đã xảy ra lỗi trong khi thanh toán');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const updateInvoice = async () => {
    try {
      if (validate()) {
        const data: OrderCreate = {
          code: code,
          fullName: fullname,
          phone: phone,
          note: note,
          addressDetail: '',
          district: '',
          items: orderItems,
          paymentMethod: payment,
          province: '',
          expireTime:0,
          wards: '',
        };

        const url = Api.updateInvoice();
        const res = await REQUEST_API({
          url: url,
          method: 'post',
          token: token,
          data: data,
        });

        if (res.status) {
          toast.success('Cập nhật đơn hàng thành công');
          navigate(-1);
        } else {
          toast.error('Đã xảy ra lỗi trong khi cập nhật đơn hàng');
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (code != null) {
      getOrderByCode();
      setIsUpdate(true);
    } else {
      setCode(getRandomNumber(8));
    }
  }, []);

  console.log(orderItems);

  return (
    <>
      <div className="flex mt-0">
        <div className="flex flex-col border rounded-md p-5 w-[70%]">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab
                  label="Thông tin đơn hàng"
                  sx={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(41 153 255) !important' }}
                  value="1"
                />
                <Tab
                  label="Sản phẩm"
                  sx={{ fontSize: '16px', fontWeight: 'bold', color: 'rgb(41 153 255) !important' }}
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel
              value="1"
              sx={{
                paddingLeft: 'unset',
                paddingRight: 'unset',
              }}
            >
              <div className="flex items-center">
                <span className="text-base text-black font-bold w-[26%]">Mã đơn hàng: </span>
                <span className="text-base ml-5">{code}</span>
              </div>
              <div className="flex items-center pt-5">
                <span className="text-base text-black font-bold w-[26%] relative">
                  <span className="text-red-600 absolute -top-1 -left-2">*</span> Họ tên:{' '}
                </span>
                <input
                  onChange={(e) => setFullname(e.target.value)}
                  value={fullname}
                  className="text-base bg-transparent indent-2 ml-5 border border-black rounded-md focus:border focus:border-black flex-1"
                />
              </div>
              <div className="flex items-center pt-5">
                <span className="text-base text-black font-bold w-[26%] relative">
                  <span className="text-red-600 absolute -top-1 -left-2">*</span>Số điện thoại:{' '}
                </span>
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  className="text-base bg-transparent indent-2 ml-5 border flex-1 border-black focus:border focus:border-black rounded-md"
                />
              </div>
              <div className="flex items-center pt-5">
                <span className="text-base text-black font-bold w-[26%]">Note: </span>
                <textarea
                  onChange={(e) => setNote(e.target.value)}
                  value={note}
                  rows={3}
                  className="resize-none outline-none text-base indent-2 bg-transparent flex-1 ml-5 border border-black rounded-md"
                />
              </div>
              {/* <div className="flex items-center pt-5">
                <span className="text-base text-black font-bold">Thanh toán: </span>
                <span className="text-base ml-5">{order?.isCheckout ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
              </div> */}
              <div className="flex items-center pt-5">
                <span className="text-base text-black font-bold">Phương thức thanh toán: </span>
                <span className="text-base ml-5">{payment}</span>
                {/* <Select
                  value={order?.paymentMethod}
                  onChange={(e) => setPayment(e.target.value)}
                  labelId="payment-select"
                  id="payment-select"
                  label="Phương thức"
                >
                  <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
                  <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
                  <MenuItem value="Quẹt thẻ">Quẹt thẻ</MenuItem>
                </Select> */}
              </div>
              {isUpdate && (
                <>
                  <div className="pt-5">
                    <span className="text-lg font-semibold text-blue">Trạng thái đơn hàng</span>
                  </div>
                  <div className="w-full h-[1px] bg-black my-1"></div>
                  <div className="flex items-center pt-3">
                    <span className="text-base font-bold text-orange-500">Chờ thanh toán</span>
                  </div>
                </>
              )}
            </TabPanel>
            <TabPanel
              value="2"
              sx={{
                paddingLeft: 'unset',
                paddingRight: 'unset',
              }}
            >
              <div className="">
                <div className="pb-3 border-b border-black mb-5">
                  <input
                    className="h-10 border-black rounded-lg pl-3"
                    placeholder="Nhập mã sản phẩm..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <i
                    className="bx bx-search text-2xl text-blue ml-3 cursor-pointer align-middle"
                    onClick={searchProduct}
                  ></i>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-auto">
                  {product?.map((prd) => {
                    return (
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex">
                          <div>
                            <img
                              src={`${API_URL_IMAGE}${prd?.images[0]?.url}`}
                              className="max-w-[none] w-20 h-20 object-contain"
                            />
                          </div>

                          <div>
                            <h4 className="font-bold">{prd.sku}</h4>
                            <p className="text-ellipsis overflow-hidden">{prd.name}</p>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => handleAddOrderItem(prd)}
                            className="bg-blue mr-5 text-white p-2 rounded-md hover:bg-cyan-500 ease-linear"
                          >
                            Chọn
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </div>
        <div className="flex flex-col border rounded-md p-5 ml-10 w-full">
          <div className="flex">
            <span className="text-lg font-bold text-blue pb-5">Danh sách sản phẩm</span>
          </div>
          <div className="">
            <div className="w-full h-[1px] bg-black"></div>

            <div className='max-h-80 overflow-auto'>
            <table className="table w-full ">
              <thead>
                <tr>
                  <th className="w-[5%] text-center text-black border border-black">STT</th>
                  <th className="w-[25%] text-center text-black border border-black">Tên sản phẩm</th>
                  <th className="w-[15%] text-center text-black border border-black">Màu</th>
                  <th className="w-[10%] text-center text-black border border-black">Size</th>
                  <th className="w-[10%] text-center text-black border border-black">Số lượng</th>
                  <th className="w-[15%] text-center text-black border border-black">Đơn giá</th>
                  <th className="w-[5%] text-center text-black border border-black"></th>
                </tr>
              </thead>
              <tbody className="">
                {!!orderItems &&
                  !!orderItems.length &&
                  orderItems.map((item, i) => {
                    return (
                      <tr key={i} className="cursor-pointer">
                        <td className="text-center border border-black">{i + 1}</td>
                        <td className="text-center border border-black">{item.productName}</td>
                        <td className="text-center border border-black">
                          <select
                            className="bg-transparent px-2 py-1 border border-black rounded-md outline-none"
                            id="color-select"
                            value={item.valueColor}
                            onChange={(e) => hanldeSelectColor(i, e.target.value)}
                          >
                            <option value=""></option>
                            {item.color?.map((color) => {
                              return <option value={color.value}>{color.value}</option>;
                            })}
                          </select>
                        </td>
                        <td className="text-center border border-black">
                          <select
                            className="bg-transparent px-2 py-1 border border-black rounded-md outline-none"
                            id="size-select"
                            onChange={(e) => handleSelectSize(i, e.target.value, item)}
                            value={item.valueSize}
                          >
                            <option value=""></option>
                            {item.color
                              ?.find((color) => {
                                return color.value == item.valueColor;
                              })
                              ?.sizes.map((size) => {
                                return <option value={size.value}>{size.value}</option>;
                              })}
                          </select>
                        </td>
                        <td className="text-center border border-black">
                          {item.valueSize != '' && (
                            <input
                              value={item.quantity}
                              className="border-black border focus:border-black w-full px-2 py-1 rounded-md"
                              max={item.maxQuantity}
                              type="number"
                              step={1}
                              onChange={(e) => handleChangeQuantity(i, e.target.value)}
                              min={1}
                            />
                          )}
                        </td>
                        <td className="text-center border border-black">{formatPrice(item.sellPrice * item.quantity)}</td>
                        <td className="text-center border border-black text-xl text-red-500 hover:text-red-400">
                          <i onClick={() => removeItemsFromOrder(i)} className="bx bx-trash"></i>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            </div>
            <div className="w-full h-[1px] bg-black"></div>
          </div>
          <div>
            <div className="mb-3">
              <div className="flex items-center justify-between pt-5">
                <span className="text-base text-black font-bold">Tổng tiền của đơn hàng:</span>
                <span className="text-xl">
                  {orderItems &&
                    formatPrice(
                      orderItems?.reduce((prev, item) => {
                        return (prev += item.sellPrice * item.quantity);
                      }, 0),
                    )}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <div
                className="flex items-center justify-center bg-blue h-10 rounded-md w-[20%] self-end cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <span className="text-white font-bold">Quay lại</span>
              </div>

              {!isUpdate ? (
                <div
                  className="flex items-center justify-center bg-yellow-500 h-10 rounded-md w-[20%] self-end cursor-pointer"
                  onClick={saveOrderInQueue}
                >
                  <span className="text-white font-bold">Lưu hàng chờ</span>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center bg-yellow-500 h-10 rounded-md w-[20%] self-end cursor-pointer"
                  onClick={updateInvoice}
                >
                  <span className="text-white font-bold">Lưu</span>
                </div>
              )}

              <div
                className="flex items-center justify-center bg-green-500 h-10 rounded-md w-[20%] self-end cursor-pointer"
                onClick={openModal}
              >
                <span className="text-white font-bold">Thanh toán</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-blue font-bold text-2xl">Thanh toán</h2>

          <div className="w-full mb-5">
            <h3 className="font-bold mb-1  ">Thông tin đơn hàng</h3>
            <hr className="mb-2 bg-blue" />
            <div className="flex flex-wrap">
              <div className="w-[50%]">
                <span className="mr-3">Mã đơn hàng:</span>
                <span>{code}</span>
              </div>
              <div className="w-[50%]">
                <span className="mr-3">Họ tên khách hàng:</span>
                <span>{fullname}</span>
              </div>
              <div className="w-[50%]">
                <span className="mr-3">Số điện thoại:</span>
                <span>{phone}</span>
              </div>
              <div className="w-[50%]">
                <span className="mr-3">Note:</span>
                <span>{note}</span>
              </div>
              <div className="w-[50%]">
                <span className="mr-3">Phương thức thanh toán:</span>
                <span>{payment}</span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h3 className="font-bold mb-1 ">Danh sách sản phẩm</h3>
            <hr className="mb-2 bg-blue" />
            <div>
              <table className="border-black border">
                <thead>
                  <tr>
                    <th className="text-center border-black border text-gray-700">Tên sản phẩm</th>
                    <th className="text-center border-black border text-gray-700">Màu</th>
                    <th className="text-center border-black border text-gray-700">Size</th>
                    <th className="text-center border-black border text-gray-700">Số lượng</th>
                    <th className="text-center border-black border text-gray-700">Đơn giá</th>
                  </tr>
                </thead>

                <tbody>
                  {!!orderItems &&
                    !!orderItems.length &&
                    orderItems.map((item, i) => {
                      return (
                        <tr key={i} className="cursor-pointer">
                          <td className="text-center border-black border">{item.productName}</td>
                          <td className="text-center border-black border">{item.valueColor}</td>
                          <td className="text-center border-black border">{item.valueSize}</td>
                          <td className="text-center border-black border">{item.quantity}</td>
                          <td className="text-center border-black border">
                            {formatPrice(item.sellPrice * item.quantity)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="my-3">
            <span className="font-bold mr-5 text-gray-700">Tổng tiền: </span>
            <span className="text-2xl">
              {orderItems &&
                formatPrice(
                  orderItems?.reduce((prev, item) => {
                    return (prev += item.sellPrice * item.quantity);
                  }, 0),
                )}
            </span>
          </div>

          <div className="flex items-center justify-around w-full mt-5">
            <div
              className="cursor-pointer w-[30%] h-10 rounded-md bg-blue flex items-center justify-center"
              onClick={closeModal}
            >
              <span>Hủy</span>
            </div>
            <div
              onClick={payInvoice}
              className="flex items-center justify-center bg-green-500 h-10 rounded-md w-[30%] self-end cursor-pointer"
            >
              <span>Thanh toán</span>
            </div>

            <div
              className="flex items-center justify-center bg-red-500 h-10 rounded-md w-[30%] self-end cursor-pointer"
              onClick={printBill}
            >
              <span className="text-white font-bold">In hóa đơn</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* <ModalCus
        isOpen={isOpen}
        title={'Hủy đơn hàng'}
        content={'Bạn có chắc chắn hủy đơn hàng này?'}
        closeModal={closeModal}
        onClick={closeModal}
      /> */}
    </>
  );
};

export default CreateOrder;
