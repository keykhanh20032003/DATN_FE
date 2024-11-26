import React from 'react';
import LeftPage from '../component/leftPage';
import { useLocation, useNavigate } from 'react-router-dom';
import cartApi from '~/apis/cart.apis';
import { Order, OrderItem } from '~/types/order.type';
import path from '~/constants/path';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import { Product } from '~/types/product.type';
import productApi from '~/apis/product.apis';
import provinceApi from '~/apis/province.apis';
import '../styles.css';
import { City, District, Ward } from '~/types/province.type';

const DetailOrder = () => {
  const location = useLocation();
  const id = location.state;
  const [order, setOrder] = React.useState<Order>();
  const [productData, setProductData] = React.useState<Product[]>([]);
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);
  const navigate = useNavigate();

  const getOrder = async () => {
    try {
      const res = await cartApi.getDetailOrder(id);
      if (res.data.status) {
        setOrder(res.data.data);
        setOrderItems(res.data.data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getOrder();
  }, []);
  let totalAmount = 0;
  orderItems.forEach((item) => {
    totalAmount += item.sellPrice * item.quantity;
  });
  const getProducts = async (orderItems) => {
    const products = [];
    for (const item of orderItems) {
      if (item.productName) {
        const response = await productApi.getProductByName(item.productName);
        if (response.data.status) {
          products.push(response.data.data);
        }
      }
    }
    return products;
  };
  React.useEffect(() => {
    if (orderItems.length > 0) {
      getProducts(orderItems).then((products) => {
        setProductData(products);
      });
    }
  }, [orderItems]);
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
    <div className="layout-account">
      <div className="container">
        <div className="wrapbox-content-account">
          <div className="header-page clearfix">
            <h1>Thông tin đơn hàng</h1>
          </div>
          <div className="row">
            <LeftPage />
            {/* view_address */}
            <div className="col-lg-9 col-md-12 col-12 ">
              <div className="grouptitle-order">
                <h3 className="order_name">
                  Đơn hàng: #{order?.codeOrders},<span className="order_date">Đặt lúc — {order?.orderDate}</span>
                </h3>
                <div id="order_cancelled" className="flash notice">
                  <h4 id="order_cancelled_title">
                    <span className="">{order?.status === 1 && 'Chờ xác nhận'}</span>
                    <span className="da-xac-nhan">{order?.status === 2 && 'Đã xác nhận'}</span>
                    <span className="dang-giao">{order?.status === 3 && 'Đang giao'}</span>
                    <span className="da-giao">{order?.status === 4 && 'Đã giao'}</span>
                    <span className="da-huy">{order?.status === 0 && 'Đã hủy'}</span>
                    <span className="bung-hang">{order?.status === 5 && 'Từ chối nhận hàng'}</span>
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <a id="return_to_store" className="order_backhome cursor-pointer" onClick={() => navigate(-1)}>
                    Quay lại trang tài khoản{' '}
                  </a>
                </div>
                <div className="col-12 content-page ">
                  <div className="customer-table-wrap">
                    <div className="customer-table-bg">
                      <p className="title-detail">Chi tiết đơn hàng </p>
                      <div className="wrap-table-orderline table-responsive-overflow">
                        <div className="table-responsive">
                          <table id="order_details" className="table table-customers ">
                            <thead>
                              <tr>
                                <th className="" />
                                <th className="">Sản phẩm</th>
                                <th className="text-center">Mã sản phẩm</th>
                                <th className="text-center">Đơn giá</th>
                                <th className="text-center">Số lượng</th>
                                <th className="total text-end">Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody>
                              {!!orderItems &&
                                !!orderItems.length &&
                                orderItems.map((item, i) => {
                                  const product = productData[i];
                                  return (
                                    <tr className="line-order odd" key={i}>
                                      <td className="order-image">
                                        <a
                                          className="cursor-pointer"
                                          onClick={() => navigate(path.detailProduct, { state: item.productName })}
                                        >
                                          <img
                                            alt={item.productName}
                                            src={`${API_URL_IMAGE}${product?.images[0]?.url}`}
                                          />
                                        </a>
                                      </td>
                                      <td className="name" style={{ maxWidth: 300 }}>
                                        <a
                                          className="cursor-pointer"
                                          onClick={() => navigate(path.detailProduct, { state: item.productName })}
                                        >
                                          {item.productName}
                                        </a>{' '}
                                        <br />
                                        <span className="variant_acc">
                                          {item.valueColor} / {item.valueSize}
                                        </span>
                                      </td>
                                      <td className="sku text-center">{product?.sku}</td>
                                      <td className="money text-center">{formatPrice(item.sellPrice)}</td>
                                      <td className="quantity center text-center">{item.quantity}</td>
                                      <td className="total money text-end">
                                        {formatPrice(item.sellPrice * item.quantity)}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="wrap-table-ordership">
                        <table className="table table-customers table-customers-summary ">
                          <tbody>
                            <tr className="order_summary ">
                              <td className="text-start" colSpan={4}>
                                <b>Giá sản phẩm</b>
                              </td>
                              <td className="total money text-end">
                                <b>{formatPrice(totalAmount)}</b>
                              </td>
                            </tr>
                            <tr className="order_summary ">
                              <td className="text-start" colSpan={4}>
                                <b>Giao hàng tận nơi</b>
                              </td>
                              <td className="total money text-end">
                                <b>{formatPrice(order?.shippingFee)}</b>
                              </td>
                            </tr>
                            <tr className="order_summary order_total">
                              <td className="text-start" colSpan={4}>
                                <b>Tổng tiền</b>
                              </td>
                              <td className="total money text-end">
                                <b>{formatPrice(totalAmount + order?.shippingFee)} </b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="customer-status-order">
                    <div className="row">
                      <div id="order_payment" className="col-lg-6 col-6 order-payment">
                        <h3 className="order_section_title">Địa chỉ nhận hàng</h3>
                        <div className="alert alert-info">
                          <span className="text_status">Tình trạng thanh toán:</span>{' '}
                          <span className="status_pending">
                            {order?.isCheckout ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </span>
                        </div>
                        <div className="box-address">
                          <p className="adressName ">{order?.fullName}</p>
                          <p />
                          <p>{order?.addressDetail}</p>
                          <p />
                          <p> {wardName?.name}</p>
                          <p>{districtName?.name}</p>
                          <p>{cityName?.name}</p>
                          <p>{order?.phone}</p>
                        </div>
                      </div>
                      {/* <div id="order_shipping" className="col-lg-6 col-6 order-shipping">
                        <h3 className="order_section_title">Địa chỉ gửi hàng</h3>
                        <div className="alert alert-info">
                          <span className="text_status">Vận chuyển:</span>
                          <span className="status_not fulfilled">Chờ xử lý</span>
                        </div>
                        <div className="box-address">
                          <p className="adressName ">Nguyễn Kim Thăng</p>
                          <p />
                          <p>Nguyệt Đức</p>
                          <p />
                          <p> Cần Thơ</p>
                          <p>Vietnam </p>
                          <p>0966821574</p>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;
