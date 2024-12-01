import React from 'react';
import '../styles.css';
import Images from '~/static';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import { Order, OrderItem } from '~/types/order.type';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import { Product } from '~/types/product.type';
import provinceApi from '~/apis/province.apis';
import { City, District, Ward } from '~/types/province.type';
import paymentMethodApi from '~/apis/paymentMethod.apis';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import { REQUEST_API } from '~/constants/method';
import cartApi from '~/apis/cart.apis';
import orderApi from '~/apis/order.apis';

const ThankYou = () => {
  const token = useSelector((state: RootState) => state.AuthReducer.token);
  const orderItemJSON = localStorage.getItem('cartItem');
  const orderJSON = localStorage.getItem('carts');
  const dataJSON = localStorage.getItem('data');
  const productDataJSON = localStorage.getItem('productData');
  const orderItem: OrderItem[] = orderItemJSON ? JSON.parse(orderItemJSON) : [];
  const order: Order = orderJSON ? JSON.parse(orderJSON) : {};
  const data = dataJSON ? JSON.parse(dataJSON) : null;
  const productData: Product[] = productDataJSON ? JSON.parse(productDataJSON) : [];
  const [order2, setOrder2] = React.useState<Order>();

  const [success, setSuccess] = React.useState(true);
  const [isShowmore, setIsShowmore] = React.useState(false);
  let totalAmount = 0;
  orderItem.forEach((item) => {
    totalAmount += item?.sellPrice * item?.quantity;
  });
  const urlParams = new URLSearchParams(window.location.search);
  const getResultVNPay = async () => {
    if (!!token) {
      if (!!urlParams) {
        try {
          const vnp_Amount = urlParams.get('vnp_Amount');
          const vnp_BankCode = urlParams.get('vnp_BankCode');
          const vnp_BankTranNo = urlParams.get('vnp_BankTranNo');
          const vnp_CardType = urlParams.get('vnp_CardType');
          const vnp_OrderInfo = urlParams.get('vnp_OrderInfo');
          const vnp_PayDate = urlParams.get('vnp_PayDate');
          const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
          const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
          const vnp_TxnRef = urlParams.get('vnp_TxnRef');
          const params = {
            vnp_OrderInfo: vnp_OrderInfo,
            vnp_Amount: vnp_Amount,
            vnp_BankCode: vnp_BankCode,
            vnp_BankTranNo: vnp_BankTranNo,
            vnp_CardType: vnp_CardType,
            vnp_PayDate: vnp_PayDate,
            vnp_ResponseCode: vnp_ResponseCode,
            vnp_TransactionNo: vnp_TransactionNo,
            vnp_TxnRef: vnp_TxnRef,
          };
          const url = `${paymentMethodApi.getResultVnPay()}?${new URLSearchParams(params)}`;
          const [res] = await Promise.all([
            REQUEST_API({
              url: url,
              method: 'get',
              token: token,
            }),
          ]);
          if (res.status) {
            setSuccess(true);
            createOrder();
          } else {
            setSuccess(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  React.useEffect(() => {
    if (
      urlParams.get('vnp_Amount') &&
      urlParams.get('vnp_BankCode') &&
      urlParams.get('vnp_BankTranNo') &&
      urlParams.get('vnp_CardType') &&
      urlParams.get('vnp_OrderInfo') &&
      urlParams.get('vnp_PayDate') &&
      urlParams.get('vnp_ResponseCode') &&
      urlParams.get('vnp_TransactionNo') &&
      urlParams.get('vnp_TxnRef')
    ) {
      getResultVNPay();
    }
  }, []);
  const createOrder = async () => {
    try {
      const res = await cartApi.orderCart(order.id, data);
      if (res.data.data) {
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getResultZaloPay = async () => {
    if (!!token) {
      if (!!urlParams) {
        try {
          const apptransid = urlParams.get('apptransid');
          const url = paymentMethodApi.getZaloStatus(apptransid);
          const [res] = await Promise.all([
            REQUEST_API({
              url: url,
              method: 'get',
              token: token,
            }),
          ]);
          if (res.returncode === 1) {
            setSuccess(true);
            createOrder();
          } else {
            setSuccess(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  React.useEffect(() => {
    if (urlParams.get('apptransid')) {
      getResultZaloPay();
    }
  }, []);
  const getOrder = async () => {
    try {
      const res = await cartApi.getDetailOrder(order.id);
      if (res.data.status) {
        setOrder2(res.data.data);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    if (order) {
      getOrder();
    }
  }, []);
  const handleBack = () => {
    localStorage.removeItem('cartItem');
    localStorage.removeItem('carts');
    localStorage.removeItem('data');
    localStorage.removeItem('productData');
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
      const res = await provinceApi.districtApi(data?.province);
      if (res.status === 200) {
        setDistricts(res.data.districts);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getWards = async () => {
    try {
      const res = await provinceApi.wardApi(data?.district);

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
    if (!!data) {
      getDistricts();
    }
  }, []);
  React.useEffect(() => {
    if (!!data) {
      getWards();
    }
  }, []);
  const cityName = cities.find((city) => city.code === parseInt(data?.province || ''));
  const districtName = districts.find((district) => district.code === parseInt(data?.district || ''));
  const wardName = wards.find((ward) => ward.code === parseInt(data?.wards || ''));
  return (
    <div className="flexbox check-out">
      <div className="banner">
        <div className="wrap">
          <Link to={path.home} className="logo cursor-pointer">
            <img src={Images.logo} className="logo-text" />
          </Link>
        </div>
      </div>
      <button
        className={`order-summary-toggle ${isShowmore ? 'order-summary-toggle-show' : 'order-summary-toggle-hide'}`}
        onClick={() => setIsShowmore(!isShowmore)}
      >
        <div className="wrap">
          <div className="order-summary-toggle-inner">
            <div className="order-summary-toggle-icon-wrapper">
              <svg width={20} height={19} xmlns="http://www.w3.org/2000/svg" className="order-summary-toggle-icon">
                <path d="M17.178 13.088H5.453c-.454 0-.91-.364-.91-.818L3.727 1.818H0V0h4.544c.455 0 .91.364.91.818l.09 1.272h13.45c.274 0 .547.09.73.364.18.182.27.454.18.727l-1.817 9.18c-.09.455-.455.728-.91.728zM6.27 11.27h10.09l1.454-7.362H5.634l.637 7.362zm.092 7.715c1.004 0 1.818-.813 1.818-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817zm9.18 0c1.004 0 1.817-.813 1.817-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817z" />
              </svg>
            </div>
            <div className="order-summary-toggle-text order-summary-toggle-text-show">
              <span>Hiển thị thông tin đơn hàng</span>
              <svg
                width={11}
                height={6}
                xmlns="http://www.w3.org/2000/svg"
                className="order-summary-toggle-dropdown"
                fill="#000"
              >
                <path d="M.504 1.813l4.358 3.845.496.438.496-.438 4.642-4.096L9.504.438 4.862 4.534h.992L1.496.69.504 1.812z" />
              </svg>
            </div>
            <div className="order-summary-toggle-text order-summary-toggle-text-hide">
              <span>Ẩn thông tin đơn hàng</span>
              <svg
                width={11}
                height={7}
                xmlns="http://www.w3.org/2000/svg"
                className="order-summary-toggle-dropdown"
                fill="#000"
              >
                <path d="M6.138.876L5.642.438l-.496.438L.504 4.972l.992 1.124L6.138 2l-.496.436 3.862 3.408.992-1.122L6.138.876z" />
              </svg>
            </div>
            <div className="order-summary-toggle-total-recap">
              <span className="total-recap-final-price">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </button>
      <div className="content">
        <div className="wrap">
          <div className="sidebar-checkout">
            <div className="sidebar-checkout-content">
              <div
                className={`order-summary ${isShowmore ? 'order-summary-is-expanded' : 'order-summary-is-collapsed'}`}
              >
                <h2 className="visually-hidden">Thông tin đơn hàng</h2>
                <div className="order-summary-sections">
                  <div
                    className="order-summary-section order-summary-section-product-list"
                    data-order-summary-section="line-items"
                  >
                    <table className="product-table">
                      <thead>
                        <tr>
                          <th scope="col">
                            <span className="visually-hidden">Hình ảnh</span>
                          </th>
                          <th scope="col">
                            <span className="visually-hidden">Mô tả</span>
                          </th>
                          <th scope="col">
                            <span className="visually-hidden">Số lượng</span>
                          </th>
                          <th scope="col">
                            <span className="visually-hidden">Giá</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {!!orderItem &&
                          !!orderItem.length &&
                          orderItem.map((item, i) => {
                            const product = productData[i];
                            return (
                              <tr className="product" key={i}>
                                <td className="product-image">
                                  <div className="product-thumbnail">
                                    <div className="product-thumbnail-wrapper">
                                      <img
                                        className="product-thumbnail-image"
                                        src={`${API_URL_IMAGE}${product.images[0].url}`}
                                      />
                                    </div>
                                    <span className="product-thumbnail-quantity" aria-hidden="true">
                                      {item.quantity}
                                    </span>
                                  </div>
                                </td>
                                <td className="product-description">
                                  <span className="product-description-name order-summary-emphasis">
                                    {item.productName}
                                  </span>
                                  <span className="product-description-variant order-summary-small-text">Đen / S</span>
                                </td>
                                <td className="product-quantity visually-hidden">{item.quantity}</td>
                                <td className="product-price">
                                  <span className="order-summary-emphasis">
                                    {formatPrice(item.quantity * item.sellPrice)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="order-summary-section order-summary-section-total-lines payment-lines">
                    <table className="total-line-table">
                      <thead>
                        <tr>
                          <th scope="col">
                            <span className="visually-hidden">Mô tả</span>
                          </th>
                          <th scope="col">
                            <span className="visually-hidden">Giá</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="total-line total-line-subtotal">
                          <td className="total-line-name">Tạm tính</td>
                          <td className="total-line-price">
                            <span className="order-summary-emphasis">{formatPrice(totalAmount)}</span>
                          </td>
                        </tr>
                        <tr className="total-line total-line-shipping">
                          <td className="total-line-name">Phí vận chuyển</td>
                          <td className="total-line-price">
                            <span className="order-summary-emphasis">
                              {totalAmount >= 500000 ? 'Miễn phí' : `${formatPrice(order.shippingFee)}`}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="total-line-table-footer">
                        <tr className="total-line">
                          <td className="total-line-name payment-due-label">
                            <span className="payment-due-label-total">Tổng cộng</span>
                          </td>
                          <td className="total-line-name payment-due">
                            <span className="payment-due-currency">VND</span>
                            <span className="payment-due-price">{formatPrice(order.shippingFee + totalAmount)}</span>
                            <span className="checkout_version"></span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="main">
            <div className="main-header">
              <Link to={path.home} className="logo cursor-pointer">
                <img src={Images.logo} className="logo-text" />
              </Link>
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    '\n\t\t\t\t\t\t\ta.logo{display: block;}\n\t\t\t\t\t\t\t\t\t\t\t.logo-cus{ \n\t\t\t\t\t\t\t\t\t\t\t\twidth: 100%; padding: 15px 0; \n\t\t\t\t\t\t\t\t\t\t\t\ttext-align: ; \n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t.logo-cus img{ max-height: 4.2857142857em  }\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t.logo-text{\n\t\t\t\t\t\t\t\t\t\t\t\ttext-align: ; \n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t            @media (max-width: 767px){\n\t\t\t\t\t\t\t\t\t\t\t\t.banner a{ display: block; }\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t',
                }}
              />
            </div>
            <div className="main-content">
              <div>
                <div className="section">
                  {success ? (
                    <>
                      <div className="section-header os-header">
                        <svg
                          width={50}
                          height={50}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="#000"
                          strokeWidth={2}
                          className="hanging-icon checkmark"
                        >
                          <path
                            className="checkmark_circle"
                            d="M25 49c13.255 0 24-10.745 24-24S38.255 1 25 1 1 11.745 1 25s10.745 24 24 24z"
                          />
                          <path className="checkmark_check" d="M15 24.51l7.307 7.308L35.125 19" />
                        </svg>
                        <div className="os-header-heading">
                          <h2 className="os-header-title">Đặt hàng thành công</h2>
                          <span className="os-order-number">Mã đơn hàng #{order2?.codeOrders}</span>
                          <span className="os-description">Cám ơn bạn đã mua hàng!</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="section-header os-header">
                        <svg
                          width={50}
                          height={50}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="#000"
                          strokeWidth={2}
                          className="hanging-icon hanging-icon-error xmark"
                        >
                          <path
                            className="xmark_circle"
                            d="M25 49c13.255 0 24-10.745 24-24S38.255 1 25 1 1 11.745 1 25s10.745 24 24 24z"
                          />
                          <path className="xmark_check1" d="M16 16l18 18" />
                          <path className="xmark_check2" d="M34 16l-18 18" />
                        </svg>
                        <div className="os-header-heading">
                          <h2 className="os-header-title">Hủy thanh toán</h2>
                          <span className="os-order-number">Mã đơn hàng #{order.codeOrders}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="section thank-you-checkout-info">
                  <div className="section-content">
                    <div className="content-box">
                      <div className="content-box-row content-box-row-padding content-box-row-no-border">
                        <h2>Thông tin đơn hàng</h2>
                      </div>
                      <div className="content-box-row content-box-row-padding">
                        <div className="section-content">
                          <div className="section-content-column">
                            <h3>Thông tin giao hàng</h3>
                            {data.fullName}
                            <br />
                            {data.phone}
                            <br />
                            <p>
                              {data.addressDetail}
                              <br />
                              {wardName?.name}
                              <br />
                              {districtName?.name}
                              <br />
                              {cityName?.name}
                              <br />
                            </p>
                            {/* <h3>Phương thức thanh toán</h3>
                            <p>{order.paymentMethod === }</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="step-footer">
                  {success ? (
                    <Link to={path.home} className="step-footer-continue-btn btn" onClick={handleBack}>
                      <span className="btn-content">Tiếp tục mua hàng</span>
                    </Link>
                  ) : (
                    <Link to={path.cart} className="step-footer-continue-btn btn">
                      <span className="btn-content">Thanh toán lại</span>
                    </Link>
                  )}
                  <p className="step-footer-info">
                    <i className="icon icon-os-question" />
                    <span>
                      Cần hỗ trợ?{' '}
                      <a href="fashionhub@gmail.com" onClick={handleBack}>
                        Liên hệ chúng tôi
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="hrv-coupons-popup-site-overlay" />
            <div className="main-footer footer-powered-by">Powered by Kim Thăng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
