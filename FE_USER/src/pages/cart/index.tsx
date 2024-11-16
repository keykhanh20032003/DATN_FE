import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cartApi from '~/apis/cart.apis';
import productApi from '~/apis/product.apis';
import Breadcrum from '~/components/breadcrumb';
import path from '~/constants/path';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import { RootState } from '~/redux/reducers';
import { Order, OrderItem } from '~/types/order.type';
import { Product, ProductImages } from '~/types/product.type';
import { User } from '~/types/user.type';
import './styles.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import { Pagination, Navigation, Thumbs, FreeMode } from 'swiper/modules';
import ItemProduct from '~/components/product';
import saleApi from '~/apis/sale.apis';
import { Sale } from '~/types/sale.type';
import Types from '~/redux/types';
import CartAction from '~/redux/actions/cartAction';
const Cart = () => {
  const user: User = useSelector((state: RootState) => state.AuthReducer.user);
  const navigate = useNavigate();
  const [carts, setCarts] = React.useState<Order>();
  const [cartItem, setCartItem] = React.useState<OrderItem[]>([]);
  const [productData, setProductData] = React.useState<Product[]>([]);
  const [randomProduct, setRandomProduct] = React.useState<Product[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [note, setNote] = React.useState('');
  const dispatch = useDispatch();

  const getCart = async () => {
    if (user) {
      try {
        const res = await cartApi.getCart(user.id);
        if (res.data.status) {
          setCarts(res.data.data);
          setCartItem(res.data.data.items);
        } else {
          // toast.error(`${res.data.data}`, {
          //   position: 'top-right',
          //   pauseOnHover: false,
          //   theme: 'dark',
          // });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    getCart();
  }, []);
  const getProducts = async (cartItems) => {
    const products = [];
    for (const item of cartItems) {
      if (item.productName) {
        const response = await productApi.getProductByName(item.productName);
        if (response.data.status) {
          products.push(response.data.data);
        }
      }
    }
    return products;
  };
  const getRandomProduct = async () => {
    try {
      const res = await productApi.getRandomProduct();
      if (res.data.status) {
        setRandomProduct(res.data.data);
      } else {
        // toast.error(`${res.data.data}`, {
        //   position: 'top-right',
        //   pauseOnHover: false,
        //   theme: 'dark',
        // });
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getRandomProduct();
  }, []);
  const getSale = async (id: number) => {
    try {
      const res = await saleApi.getSale(id);
      if (res.data.status) {
        const sale = res.data.data;
        setSales((prevMapping) => ({
          ...prevMapping,
          [sale.id]: sale.discount,
        }));
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
  const checkOrder = async () => {
    try {
      const res = await cartApi.checkOrder(carts?.id);
      if (res.data.status) {
        navigate(path.checkOut, { state: { carts, cartItem, productData, note } });
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
    if (randomProduct.length > 0) {
      randomProduct.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0 && item.sale != undefined) {
          await getSale(item.sale);
        }
      });
    }
  }, [randomProduct]);
  React.useEffect(() => {
    if (cartItem.length > 0) {
      getProducts(cartItem).then((products) => {
        setProductData(products);
      });
    }
  }, [cartItem]);
  const deleteItemFromCart = async (id: number) => {
    try {
      const res = await cartApi.deleteFromCart(id);
      if (res.data.status) {
        dispatch(CartAction.removeFromCart(id));
        toast.success(`Xóa sản phẩm thành công`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        await getCart();
        if (cartItem.length === 1) {
          dispatch(CartAction.clearCart());
          setCarts();
          setCartItem([]);
        }
      } else {
        // toast.error(`${res.data.data}`, {
        //   position: 'top-right',
        //   pauseOnHover: false,
        //   theme: 'dark',
        // });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const minusItem = async (id: number) => {
    try {
      const res = await cartApi.delete1Item(id);
      if (res.data.status) {
        getCart();
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
  const plusItem = async (id: number) => {
    try {
      const res = await cartApi.plusItem(id);
      if (res.data.status) {
        getCart();
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
  let totalAmount = 0;
  cartItem.forEach((item) => {
    totalAmount += item.sellPrice * item.quantity;
  });
  const remainingAmount = 500000 - totalAmount;
  const percentage = Math.min(totalAmount / 500000, 1) * 100;

  return (
    <div id="layout-cart">
      <Breadcrum title="Giỏ hàng" />
      <div className="wrapper-mainCart">
        <div className="content-bodyCart">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12 col-12 contentCart-detail">
                <div className="mainCart-detail">
                  <div className="heading-cart heading-row">
                    <h1>Giỏ hàng của bạn</h1>
                    <p className="title-number-cart">
                      Bạn đang có <strong className="count-cart">{cartItem.length} sản phẩm</strong> trong giỏ hàng
                    </p>
                    <div className="cart-shipping ">
                      {carts?.shippingFee === 0 ? (
                        <div className="cart-shipping__title">
                          Bạn đã được <span className="free-ship">miễn phí vận chuyển</span>
                        </div>
                      ) : (
                        <div className="cart-shipping__title">
                          Bạn cần mua thêm <span className="price">{formatPrice(remainingAmount)}</span> để được{' '}
                          <span className="free-ship">miễn phí vận chuyển</span>
                        </div>
                      )}
                      <div className="cart-shipping__bar ">
                        <span className="shipping-bar" style={{ width: `${percentage}%` }}>
                          <span className="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={18}
                              height={18}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-truck"
                            >
                              <rect x={1} y={3} width={15} height={13} />
                              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                              <circle cx="5.5" cy="18.5" r="2.5" />
                              <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {carts === undefined && (
                    <div className="expanded-content">
                      <div className="expanded-info">
                        <div className="info-image">
                          <img
                            data-src="//theme.hstatic.net/200000690725/1001078549/14/cart_banner_image.jpg?v=113"
                            src="//theme.hstatic.net/200000690725/1001078549/14/cart_banner_image.jpg?v=113"
                            className=" lazyloaded"
                            alt="Giỏ hàng của bạn đang trống"
                          />
                        </div>
                        <div className="info-text">
                          <p className="text1">Chưa có sản phẩm trong giỏ hàng...</p>
                          <p className="text2">
                            Quay về <Link to={path.home}>trang chủ</Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="list-pageform-cart">
                    <form action="/cart" method="post" id="cartformpage">
                      <div className="cart-row">
                        <div className="table-cart">
                          {!!cartItem &&
                            !!cartItem.length &&
                            cartItem.map((item, i) => {
                              const product = productData[i];
                              return (
                                <div className="media-line-item line-item" key={i}>
                                  <div className="media-left">
                                    <div className="item-img">
                                      <Link to={'#'}>
                                        <img src={`${API_URL_IMAGE}${product?.images[0]?.url}`} />
                                      </Link>
                                    </div>
                                    <div className="item-remove" onClick={() => deleteItemFromCart(item.id)}>
                                      <a className="cart cursor-pointer">Xóa</a>
                                    </div>
                                  </div>
                                  <div className="media-right">
                                    <div className="item-info">
                                      <h3 className="item--title">
                                        <Link to={'#'}>{item.productName}</Link>
                                      </h3>
                                      <div className="item--variant">
                                        <span>
                                          {item.valueColor} / {item.valueSize}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="item-price">
                                      <p>
                                        <span>{formatPrice(product?.salePrice)}</span>
                                        {product?.sale !== 0 && <del>{formatPrice(product?.price)}</del>}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="media-total">
                                    <div className="item-total-price">
                                      <div className="price">
                                        <span className="line-item-total">
                                          {formatPrice(item.sellPrice * item.quantity)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="item-qty">
                                      <div className="qty quantity-partent qty-click clearfix">
                                        <button
                                          type="button"
                                          className="qtyminus qty-btn"
                                          onClick={() => {
                                            if (item?.quantity > 1) {
                                              minusItem(item.id);
                                            }
                                          }}
                                        >
                                          <svg enableBackground="new 0 0 10 10" viewBox="0 0 10 10" x={0} y={0}>
                                            <polygon points="4.5 4.5 3.5 4.5 0 4.5 0 5.5 3.5 5.5 4.5 5.5 10 5.5 10 4.5" />
                                          </svg>
                                        </button>
                                        <input
                                          type="text"
                                          size={4}
                                          min={1}
                                          value={item?.quantity}
                                          readOnly
                                          className="tc line-item-qty item-quantity"
                                        />
                                        <button
                                          type="button"
                                          className="qtyplus qty-btn"
                                          onClick={() => plusItem(item.id)}
                                        >
                                          <svg enableBackground="new 0 0 10 10" viewBox="0 0 10 10" x={0} y={0}>
                                            <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className="cart-row">
                        <div className="order-noted-block">
                          <div className="container-pd15">
                            <div className="checkout-buttons clearfix">
                              <label htmlFor="note" className="note-label">
                                Ghi chú đơn hàng
                              </label>
                              <textarea
                                className="form-control"
                                id="note"
                                name="note"
                                rows={5}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                              />
                            </div>
                            <button
                              type="submit"
                              id="checkout"
                              className="btn-checkout button d-none "
                              name="checkout"
                              value=""
                            >
                              Thanh toán
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* <div className="cart-row">
                        <div className="order-invoice-block">
                          <div className="checkbox">
                            <input type="hidden" name="attributes[invoice]" id="re-checkbox-bill" defaultValue="no" />
                            <input
                              type="checkbox"
                              id="checkbox-bill"
                              defaultValue="yes"
                              name="regular-checkbox"
                              className="regular-checkbox"
                            />
                            <label htmlFor="checkbox-bill" className="box" />
                            <label htmlFor="checkbox-bill" className="title">
                              Xuất hoá đơn cho đơn hàng
                            </label>
                          </div>
                          <div className="bill-field">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control val-f check_change"
                                name="attributes[bill_order_company]"
                                defaultValue=""
                                placeholder="Tên công ty..."
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="number"
                                pattern=".{10,}"
                                onkeydown="return HRT.Module.FilterInput(event)"
                                onpaste="HRT.Module.handlePaste(event)"
                                className="form-control val-f val-n check_change"
                                name="attributes[bill_order_tax_code]"
                                defaultValue=""
                                placeholder="Mã số thuế..."
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="email"
                                className="form-control val-f val-mail check_change"
                                name="attributes[bill_email]"
                                defaultValue=""
                                placeholder="Email..."
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control val-f check_change"
                                name="attributes[bill_order_address]"
                                defaultValue=""
                                placeholder="Địa chỉ công ty..."
                              />
                            </div>
                            <div className="form-btn">
                              <a href="javascript:void();" className="button btndark btn-save">
                                Lưu thông tin
                              </a>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </form>
                  </div>
                </div>
                <div className="collectionCart-detail">
                  {/* <div className="collectionCart-inner">
                    <h2 className="collectionCart-title">
                      <a href="/collections/ao-thun">Có thể bạn sẽ thích</a>
                    </h2>
                    <div className="collectionCart-product">
                      <Swiper
                        slidesPerView={4}
                        spaceBetween={30}
                        loop={true}
                        navigation={true}
                        modules={[Navigation]}
                        className="list-product-slide"
                      >
                        {!!randomProduct &&
                          !!randomProduct.length &&
                          randomProduct.map((item, i) => {
                            return (
                              <SwiperSlide key={i} className="">
                                <ItemProduct
                                  id={item.id}
                                  name={item.name}
                                  price={item.price}
                                  salePrice={item.salePrice}
                                  img1={item.images[0].url}
                                  img2={item.images[1].url}
                                  sale={`${sales[item.sale]}`}
                                  slide
                                />
                              </SwiperSlide>
                            );
                          })}
                      </Swiper>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className={`col-lg-4 col-md-12 col-12 sidebarCart-sticky ${carts === undefined ? 'is-hidden' : ''}`}>
                <div className="wrap-order-summary">
                  <div className="order-summary-block">
                    <h2 className="summary-title">Thông tin đơn hàng</h2>
                    <div className="summary-total">
                      <p>
                        Tổng tiền: <span>{formatPrice(totalAmount)}</span>
                      </p>
                    </div>
                    <div className="summary-action">
                      <p>Phí vận chuyển sẽ được tính ở trang thanh toán.</p>
                      <p>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</p>{' '}
                      <div
                        className="summary-alert alert alert-danger"
                        style={carts === undefined ? { display: 'block' } : {}}
                      >
                        Giỏ hàng của bạn hiện chưa đạt mức tối thiểu để thanh toán.
                      </div>
                    </div>
                    <div className="summary-button" onClick={checkOrder}>
                      <a
                        id="btnCart-checkout"
                        className={`checkout-btn btnred ${carts === undefined ? 'disabled' : ''}`}
                        href="#"
                      >
                        THANH TOÁN{' '}
                      </a>
                    </div>
                  </div>
                  <div className="order-summary-block order-summary-notify ">
                    <div className="summary-warning alert-order">
                      <p className="textmr">
                        <strong>Chính sách mua hàng</strong>:
                      </p>
                      <p>
                        Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu <strong>0₫ </strong> trở
                        lên.
                      </p>
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

export default Cart;
