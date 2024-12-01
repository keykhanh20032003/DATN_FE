import React from 'react';
import './styles.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import Images from '~/static';
import { User } from '~/types/user.type';
import { RootState } from '~/redux/reducers';
import { useSelector } from 'react-redux';
import Input from './component/input';
import { Order, OrderItem } from '~/types/order.type';
import { Product } from '~/types/product.type';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import { City, District, Ward } from '~/types/province.type';
import provinceApi from '~/apis/province.apis';
import { toast } from 'react-toastify';
import cartApi from '~/apis/cart.apis';
import paymentMethodApi from '~/apis/paymentMethod.apis';
import { REQUEST_API } from '~/constants/method';
import { Address } from '~/types/address.type';
import LoadingPage from '~/components/loadingPage';

const CheckOut = () => {
  const user: User = useSelector((state: RootState) => state.AuthReducer.user);
  const addresses: Address[] = user.addresses;
  const token = useSelector((state: RootState) => state.AuthReducer.token);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItem: OrderItem[] = location.state.cartItem;
  const carts: Order = location.state.carts;
  const productData: Product[] = location.state.productData;
  const note = location.state.note;
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [cities, setCities] = React.useState<City[]>([]);
  const [districts, setDistricts] = React.useState<District[]>([]);
  const [wards, setWards] = React.useState<Ward[]>([]);
  const [cityId, setCityId] = React.useState('');
  const [districtId, setDistrictId] = React.useState('');
  const [wardId, setWardId] = React.useState('');
  const [isShowmore, setIsShowmore] = React.useState(false);
  const [bankTransfer, setBankTransfer] = React.useState(false);
  const [payOnDelivery, setPayOnDelivery] = React.useState(false);
  const [vnPay, setVnPay] = React.useState(false);
  const [zaloPay, setZaloPay] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

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

  let totalAmount = 0;
  cartItem.forEach((item) => {
    totalAmount += item?.sellPrice * item?.quantity;
  });
  const handlePayOrder = async () => {
    const phoneNumberRegex = /^0[0-9]{9}$/;
    if (!fullName) {
      toast.error(`Vui lòng nhập họ tên của bạn`, {
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
      return;
    }
    if (!bankTransfer && !payOnDelivery && !vnPay && !zaloPay) {
      toast.error('Vui lòng chọn 1 phương thức thanh toán', {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
      return;
    }
    if (bankTransfer || payOnDelivery) {
      createOrder();
    } else if (vnPay) {
      createVnPay();
    } else if (zaloPay) {
      createZaloPay();
    }
  };
  const handlePayOnDelivery = () => {
    setPayOnDelivery(true);
    setBankTransfer(false);
  };
  const handleVNPay = () => {
    setVnPay(true);
    setBankTransfer(false);
  };
  const handleZaloPay = () => {
    setZaloPay(true);
    setBankTransfer(false);
  };
  const data = {
    fullName: fullName,
    phone: phone,
    note: note || '',
    addressDetail: address,
    province: cityId,
    district: districtId,
    wards: wardId,
  };
  localStorage.setItem('data', JSON.stringify(data));
  localStorage.setItem('cartItem', JSON.stringify(cartItem));
  localStorage.setItem('carts', JSON.stringify(carts));
  localStorage.setItem('productData', JSON.stringify(productData));
  const createVnPay = async () => {
    if (!!token) {
      try {
        setIsLoading(true);

        const url = paymentMethodApi.createVNPay(carts.id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
          }),
        ]);
        if (res.status) {
          setIsLoading(false);
          window.location.href = `${res.data}`;
        } else {
          toast.error(`Lỗi`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        toast.error(`Vui lòng đăng nhập lại`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const createOrder = async () => {
    try {
      setIsLoading(true);
      const res = await cartApi.orderCart(carts.id, data);
      if (res.data.data) {
        setIsLoading(false);
        navigate(path.thankYou, { state: { data, carts, cartItem, productData } });
      } else {
        setIsLoading(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const createZaloPay = async () => {
    if (!!token) {
      try {
        setIsLoading(true);
        const url = paymentMethodApi.createZaloPay(carts.id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
          }),
        ]);
        console.log(res);

        if (res.returncode === 1) {
          setIsLoading(false);
          window.location.href = `${res.orderurl}`;
        } else {
          toast.error(`Vui lòng thử lại sau`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        toast.error(`Vui lòng đăng nhập lại`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleChooseAddress = (e) => {
    const itemss = e.target.value;
    const item: Address | undefined = addresses.find((address) => address.id === parseInt(itemss));
    if (item) {
      setFullName(`${item.lastName} ${item.firstName}`);
      setPhone(item.phone);
      setAddress(item.addressDetail);
      setCityId(item.province);
      setDistrictId(item.district);
      setWardId(item.wards);
    } else {
      setFullName('');
      setPhone('');
      setAddress('');
      setCityId('');
      setDistrictId('');
      setWardId('');
    }
  };

  const [cityMap, setCityMap] = React.useState({});
  const [wardMap, setWardMap] = React.useState({});
  const [districtMap, setDistrictMap] = React.useState({});

  const getCitiesMap = async () => {
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
  const getDistrictsMap = async (id) => {
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
  const getWardsMap = async (id) => {
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
    getCitiesMap();
  }, []);
  React.useEffect(() => {
    if (addresses.length > 0) {
      addresses.forEach(async (item) => {
        if (item.district !== null && item.district !== undefined && !Number.isNaN(item.district)) {
          await getWardsMap(parseInt(item.district));
        }
      });
    }
  }, [addresses]);
  React.useEffect(() => {
    if (addresses.length > 0) {
      addresses.forEach(async (item) => {
        if (item.province !== null && item.province !== undefined && !Number.isNaN(item.province)) {
          await getDistrictsMap(parseInt(item.province));
        }
      });
    }
  }, [addresses]);
  const handleUseDiscount = () => {
    toast.error(`Tính năng đang phát triển`, {
      position: 'top-right',
      pauseOnHover: false,
      theme: 'dark',
    });
  };
  return (
    <div className="flexbox check-out">
      {/* nút bấm mobile */}
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
      {/* mã giảm giá */}
      <div className="content content-second">
        <div className="wrap">
          <div className="sidebar-checkout sidebar-checkout-second">
            <div className="sidebar-checkout-content">
              <div
                className={`order-summary ${isShowmore ? 'order-summary-is-collapsed' : 'order-summary-is-expanded'}`}
              >
                <div className="order-summary-sections">
                  <div
                    className="order-summary-section order-summary-section-discount"
                    data-order-summary-section="discount"
                  >
                    <div>
                      <div className="fieldset">
                        <div className="field  ">
                          <div className="field-input-btn-wrapper">
                            <div className="field-input-wrapper">
                              <label className="field-label">Mã giảm giá</label>
                              <input
                                placeholder="Mã giảm giá"
                                className="field-input"
                                autoComplete="false"
                                autoCapitalize="off"
                                spellCheck="false"
                                size={30}
                                type="text"
                              />
                            </div>
                            <button
                              className="field-input-btn btn btn-default btn-disabled"
                              onClick={handleUseDiscount}
                            >
                              <span className="btn-content">Sử dụng</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="coupon-notification">
                      Mã giảm giá không áp dụng đồng thời chương trình khuyến mãi khác
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* content */}
      <div className="content">
        <div className="wrap">
          {/* sản phẩm... */}
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
                        {!!cartItem &&
                          !!cartItem.length &&
                          cartItem.map((item, i) => {
                            const product = productData[i];
                            return (
                              <tr className="product" key={i}>
                                <td className="product-image">
                                  <div className="product-thumbnail">
                                    <div className="product-thumbnail-wrapper">
                                      <img
                                        className="product-thumbnail-image"
                                        src={`${API_URL_IMAGE}${product?.images[0]?.url}`}
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
                                  <span className="product-description-variant order-summary-small-text">
                                    {item.valueColor} / {item.valueSize}
                                  </span>
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
                  <div
                    className="order-summary-section order-summary-section-discount"
                    data-order-summary-section="discount"
                  >
                    <div>
                      <div className="fieldset">
                        <div className="field  ">
                          <div className="field-input-btn-wrapper">
                            <div className="field-input-wrapper">
                              <label className="field-label">Mã giảm giá</label>
                              <input
                                placeholder="Mã giảm giá"
                                className="field-input"
                                data-discount-field="true"
                                autoComplete="false"
                                autoCapitalize="off"
                                spellCheck="false"
                                size={30}
                                type="text"
                              />
                            </div>
                            <button
                              className="field-input-btn btn btn-default btn-disabled"
                              onClick={handleUseDiscount}
                            >
                              <span className="btn-content">Sử dụng</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="coupon-notification">
                      Mã giảm giá không áp dụng đồng thời chương trình khuyến mãi khác
                    </span>
                  </div>
                  <div
                    className="order-summary-section order-summary-section-total-lines payment-lines"
                    data-order-summary-section="payment-lines"
                  >
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
                              {totalAmount >= 500000 ? `Miễn phí` : `${formatPrice(carts.shippingFee)}`}
                            </span>
                          </td>
                        </tr>
                        <tr className="total-line">
                          <td
                            className="freeship-notification"
                            colSpan={2}
                            style={{ textAlign: 'left', color: '#a73340' }}
                          >
                            {totalAmount >= 500000 ? (
                              <>
                                Bạn được miễn phí giao hàng cho hóa đơn trên <strong>500.000đ</strong>
                              </>
                            ) : (
                              <>
                                Đừng bỏ lỡ cơ hội được <strong>miễn phí</strong> giao hàng cho hóa đơn trên{' '}
                                <strong>500.000đ</strong> bạn nhé!
                              </>
                            )}
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
                            <span className="payment-due-price">{formatPrice(totalAmount + carts.shippingFee)}</span>
                            <span className="checkout_version"></span>
                          </td>
                        </tr>
                        <tr className="total-line total-line-gift">
                          <td colSpan={2}>
                            <p>
                              Sau khi "Đặt hàng" thành công, Fashion Hub sẽ kiểm tra sản phẩm và đóng gói ngay để giao hàng
                              cho bạn. Trong quá trình kiểm tra sản phẩm nếu có phát sinh Fashion Hub sẽ liên hệ trực tiếp
                              với quý khách để xin xác nhận. Fashion Hub Xin chân thành cảm ơn!
                            </p>
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
            {/* logo */}
            <div className="main-header">
              <div onClick={() => navigate(path.home)} className="logo cursor-pointer">
                <img src={Images.logo} className="logo-text" />
              </div>
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    '\n\t\t\t\t\t\t\ta.logo{display: block;}\n\t\t\t\t\t\t\t\t\t\t\t.logo-cus{ \n\t\t\t\t\t\t\t\t\t\t\t\twidth: 100%; padding: 15px 0; \n\t\t\t\t\t\t\t\t\t\t\t\ttext-align: ; \n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t.logo-cus img{ max-height: 4.2857142857em  }\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t.logo-text{\n\t\t\t\t\t\t\t\t\t\t\t\ttext-align: ; \n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t            @media (max-width: 767px){\n\t\t\t\t\t\t\t\t\t\t\t\t.banner a{ display: block; }\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t',
                }}
              />
            </div>
            {/* chọn địa chỉ ... */}
            <div className="main-content">
              <div className="step">
                <div className="step-sections steps-onepage">
                  <div className="section">
                    <div className="section-header">
                      <h2 className="section-title">Thông tin giao hàng</h2>
                    </div>
                    <div className="section-content section-customer-information no-mb">
                      {/* user  */}
                      <div className="logged-in-customer-information">
                        &nbsp;
                        <div className="logged-in-customer-information-avatar-wrapper">
                          <div
                            className="logged-in-customer-information-avatar gravatar"
                            style={{
                              backgroundImage:
                                'url(//www.gravatar.com/avatar/9543b581101b384cdeb3df6deeb24565.jpg?s=100&d=blank)',
                              filter:
                                'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="//www.gravatar.com/avatar/9543b581101b384cdeb3df6deeb24565.jpg?s=100&d=blank", sizingMethod="scale")',
                            }}
                          />
                        </div>
                        <p className="logged-in-customer-information-paragraph">
                          {user.username} ({user.email})
                          <br />
                        </p>
                      </div>
                      {/* thông tin giao hàng */}
                      <div className="fieldset">
                        <div className="field field-show-floating-label">
                          <div className="field-input-wrapper field-input-wrapper-select">
                            <label className="field-label" htmlFor="stored_addresses">
                              Thêm địa chỉ mới...
                            </label>
                            <select className="field-input" id="stored_addresses" onChange={handleChooseAddress}>
                              <option value={0}>Địa chỉ đã lưu trữ</option>
                              {!!addresses &&
                                !!addresses.length &&
                                addresses.map((item, i) => (
                                  <option value={item.id} key={i}>
                                    {item.phone}, {item.addressDetail}, {wardMap[item.wards]},{' '}
                                    {districtMap[item.district]}, {cityMap[item.province]}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                        <Input
                          placeholder="Họ và tên"
                          id="name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <Input
                          placeholder="Số điện thoại"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* tỉnh thành */}
                    <div className="section-content">
                      <div className="fieldset">
                        <form
                          autoComplete="off"
                          id="form_update_shipping_method"
                          className="field default"
                          acceptCharset="UTF-8"
                          method="post"
                        >
                          <div className="content-box mt0">
                            <div
                              id="form_update_location_customer_shipping"
                              className="order-checkout__loading radio-wrapper content-box-row content-box-row-padding content-box-row-secondary "
                            >
                              <div className="order-checkout__loading--box">
                                <div className="order-checkout__loading--circle" />
                              </div>
                              <Input
                                placeholder="Địa chỉ"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                              <div className="field field-show-floating-label  field-third ">
                                <div className="field-input-wrapper field-input-wrapper-select">
                                  <label className="field-label" htmlFor="customer_shipping_province">
                                    {' '}
                                    Tỉnh / thành
                                  </label>
                                  <select
                                    className="field-input"
                                    id="customer_shipping_province"
                                    name="customer_shipping_province"
                                    onChange={handleCity}
                                    value={cityId}
                                  >
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
                              </div>
                              <div className="field field-show-floating-label  field-third ">
                                <div className="field-input-wrapper field-input-wrapper-select">
                                  <label className="field-label" htmlFor="customer_shipping_district">
                                    Quận / huyện
                                  </label>
                                  <select
                                    className="field-input"
                                    id="customer_shipping_district"
                                    name="customer_shipping_district"
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
                              </div>
                              <div className="field field-show-floating-label field-required  field-third  ">
                                <div className="field-input-wrapper field-input-wrapper-select">
                                  <label className="field-label" htmlFor="customer_shipping_ward">
                                    Phường / xã
                                  </label>
                                  <select
                                    className="field-input"
                                    id="customer_shipping_ward"
                                    name="customer_shipping_ward"
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
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    {/* phương thứ thanh toán  */}
                    <div id="change_pick_location_or_shipping">
                      <div id="section-shipping-rate">
                        <div className="order-checkout__loading--box">
                          <div className="order-checkout__loading--circle" />
                        </div>
                        <div className="section-header">
                          <h2 className="section-title">Phương thức vận chuyển</h2>
                        </div>
                        <div className="section-content">
                          <div className="content-box">
                            <div className="content-box-row">
                              <div className="radio-wrapper">
                                <label className="radio-label" htmlFor="shipping_rate_id_1007205">
                                  <div className="radio-input">
                                    <input
                                      id="shipping_rate_id_1007205"
                                      className="input-radio"
                                      type="radio"
                                      name="shipping_rate_id"
                                      checked
                                      readOnly
                                    />
                                  </div>
                                  <span className="radio-label-primary">
                                    {totalAmount >= 500000
                                      ? `Miễn phí giao hàng`
                                      : 'Phí giao hàng 25.000đ với đơn hàng dưới 500.000đ'}
                                  </span>
                                  <span className="radio-accessory content-box-emphasis">
                                    {totalAmount >= 500000 ? `0đ` : `25,000đ`}
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="section-payment-method" className="section">
                        <div className="order-checkout__loading--box">
                          <div className="order-checkout__loading--circle" />
                        </div>
                        <div className="section-header">
                          <h2 className="section-title">Phương thức thanh toán</h2>
                        </div>
                        <div className="section-content">
                          <div className="content-box">
                            <div className="radio-wrapper content-box-row" onClick={handlePayOnDelivery}>
                              <label className="radio-label" htmlFor="payment_method_id_1000693919">
                                <div className="radio-input payment-method-checkbox">
                                  <input
                                    id="payment_method_id_1000693919"
                                    className="input-radio"
                                    name="payment_method_id"
                                    type="radio"
                                  />
                                </div>
                                <div className="radio-content-input">
                                  <img className="main-img" src={Images.logocod} />
                                  <div>
                                    <span className="radio-label-primary">Thanh toán khi giao hàng (COD)</span>
                                    <span className="quick-tagline hidden" />
                                  </div>
                                </div>
                              </label>
                            </div>
                            <div className="radio-wrapper content-box-row" onClick={() => setBankTransfer(true)}>
                              <label className="radio-label" htmlFor="payment_method_id_1003197899">
                                <div className="radio-input payment-method-checkbox">
                                  <input
                                    type-id={2}
                                    id="payment_method_id_1003197899"
                                    className="input-radio"
                                    name="payment_method_id"
                                    type="radio"
                                  />
                                </div>
                                <div className="radio-content-input">
                                  <img className="main-img" src={Images.LogoBank} />
                                  <div>
                                    <span className="radio-label-primary">Chuyển khoản qua ngân hàng</span>
                                    <span className="quick-tagline hidden" />
                                  </div>
                                </div>
                              </label>
                            </div>
                            {bankTransfer && (
                              <div className="radio-wrapper content-box-row content-box-row-secondary">
                                <div className="blank-slate">
                                  Anh/Chị vui lòng chuyển khoản vào tài khoản sau đây: - Ngân hàng: BIDV (Ngân hàng TMCP
                                  Đầu Tư & Phát Triển Việt Nam) - Tên tài khoản: Dang Khanh - Số tài khoản:
                                  0966821574 - Chi nhánh Quang Minh * Nội Dung Chuyển Khoản: Online ck + SĐT đặt hàng.
                                  Chuyển khoản thành công Anh/Chị cho em xin ảnh chụp sao kê giao dịch và báo lại với
                                  nhân viên khi xác nhận ạ
                                </div>
                              </div>
                            )}
                            <div className="radio-wrapper content-box-row" onClick={handleVNPay}>
                              <label className="radio-label" htmlFor="payment_method_id_1003697638">
                                <div className="radio-input payment-method-checkbox">
                                  <input
                                    type-id={8}
                                    id="payment_method_id_1003697638"
                                    className="input-radio"
                                    name="payment_method_id"
                                    type="radio"
                                  />
                                </div>
                                <div className="radio-content-input">
                                  <img className="main-img" src={Images.LogoVnPay} />
                                  <div>
                                    <span className="radio-label-primary">
                                      Thẻ ATM/Visa/Master/JCB/QR Pay qua cổng VNPAY
                                    </span>
                                    <span className="quick-tagline hidden" />
                                    <img className="child-img" src={Images.atmvisamaster} />
                                  </div>
                                </div>
                              </label>
                            </div>
                            <div className="radio-wrapper content-box-row" onClick={handleZaloPay}>
                              <label className="radio-label" htmlFor="payment_method_id_zalo">
                                <div className="radio-input payment-method-checkbox">
                                  <input
                                    id="payment_method_id_zalo"
                                    className="input-radio"
                                    name="payment_method_id"
                                    type="radio"
                                  />
                                </div>
                                <div className="radio-content-input">
                                  <img className="main-img" src={Images.logoZaloPay} />
                                  <div>
                                    <span className="radio-label-primary">
                                      ZaloPay - Thanh toán trong 2s - Ứng dụng thanh toán trực tuyến
                                    </span>
                                    <span className="quick-tagline hidden" />
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* nút bấm */}
                <div className="step-footer" id="step-footer-checkout">
                  <div>
                    <button type="submit" className="step-footer-continue-btn btn" onClick={handlePayOrder}>
                      <span className="btn-content">Hoàn tất đơn hàng</span>
                    </button>
                  </div>
                  <Link className="step-footer-previous-link" to={path.cart} onClick={() => navigate(path.cart)}>
                    Giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
            <div className="hrv-coupons-popup-site-overlay" />
            <div className="main-footer footer-powered-by">Powered by Khanh Dang</div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingPage />}
    </div>
  );
};

export default CheckOut;
