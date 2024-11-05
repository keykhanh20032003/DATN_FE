import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import categoryApi from '~/apis/category.apis';
import Images from '~/static';
import { Category } from '~/types/category.type';

const Footer = () => {
  const [isOpen1, setIsOpen1] = React.useState(false);
  const [isOpen2, setIsOpen2] = React.useState(false);
  const [isOpen3, setIsOpen3] = React.useState(false);
  const [category1, setCategory1] = React.useState<Category[]>([]);
  const [category2, setCategory2] = React.useState<Category[]>([]);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const ContentStyle1 = {
    display: windowWidth < 992 ? (isOpen1 ? 'block' : 'none') : 'block',
    height: '268.25px',
    paddingTop: '10px',
    marginTop: '0px',
    paddingBottom: '0px',
    marginBottom: '40px',
  };
  const ContentStyle2 = {
    display: windowWidth < 992 ? (isOpen2 ? 'block' : 'none') : 'block',
    height: '268.25px',
    paddingTop: '10px',
    marginTop: '0px',
    paddingBottom: '0px',
    marginBottom: '20px',
  };
  const ContentStyle3 = {
    display: windowWidth < 993 ? (isOpen2 ? 'block' : 'none') : 'block',
    height: '268.25px',
    paddingTop: '10px',
    marginTop: '0px',
    paddingBottom: '0px',
    marginBottom: '20px',
  };
  const getCategory = async (id: number) => {
    try {
      const res = await categoryApi.getCategoryType(id);
      if (res.data.status) {
        return res.data.data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const data1 = await getCategory(1);
      setCategory1(data1);

      const data2 = await getCategory(2);
      setCategory2(data2);
    };

    fetchData();
  }, []);
  return (
    <div className="mainFooter ">
      <div className="footer-container">
        <div className="footer-expand-collapsed ">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-6 col-md-12 col-12 widget-footer">
                <h2 className="widget-footer__title" onClick={() => setIsOpen1(!isOpen1)}>
                  Văn phòng
                </h2>                                                                                                         
                <div className="widget-footer__content block-collapse" style={ContentStyle1}>
                  <div className="content-info">
                    <div className="ft-logo">
                      <Link to="/">
                        <img
                          itemProp="logo"
                          src={Images.logo}
                          className="img-responsive logoimg ls-is-cached lazyloaded"
                        />
                      </Link>
                    </div>
                    <div className="address-footer">
                      <ul>
                        <li className="contact-1">
                          <b>CÔNG TY TNHH DATN</b>
                          <br />
                          <b>Trụ sở chính: </b>
                          Số 7, Nghinh Tiên, <br />
                          Xã Nguyệt Đức, Huyện Yên Lạc, Tỉnh Vĩnh Phúc <br />
                        </li>
                        <li className="contact-2">
                          <b>Điện thoại:</b>
                        </li>
                        <li className="contact-4">
                          <b>Email:</b>
                        </li>{' '}
                      </ul>
                    </div>
                    <div className="footer-payment">
                      <div className="payment-title" />
                      <ul className="payment-icon"></ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-12 col-12 widget-footer">
                <h2 className="widget-footer__title">Thông tin liên hệ</h2>
                <div className="widget-footer__content block-collapse">
                  <ul className="footerNav-link">
                    <li className="item">
                      <a href="/pages/gioi-thieu" title="Về chúng tôi">
                        Về chúng tôi
                      </a>
                    </li>
                    <li className="item">
                      <a href="/pages/cau-hoi-thuong-gap" title="Câu hỏi thường gặp">
                        Câu hỏi thường gặp
                      </a>
                    </li>
                    <li className="item">
                      <a href="/blogs/tin-tuc" title="Sự kiện">
                        Sự kiện
                      </a>
                    </li>
                    <li className="item">
                      <a href="/blogs/bai-viet-noi-bat" title="Tin tức">
                        Tin tức
                      </a>
                    </li>
                    <li className="item">
                      <a href="/blogs/sao-eva" title="SAO & Eva">
                        SAO &amp; Eva
                      </a>
                    </li>
                    <li className="item">
                      <a href="/pages/he-thong-cua-hang" title="Hệ thống Showroom">
                        Hệ thống Showroom
                      </a>
                    </li>
                  </ul>
                  <div className="footer-shipment">
                    <div className="shipment-title" />
                    <ul className="shipment-icon"></ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-6 col-md-12 col-12 widget-footer">
                <h2 className="widget-footer__title">Chính sách bán hàng</h2>
                <div className="widget-footer__content block-collapse">
                  <ul className="footerNav-link">
                    <li className="item">
                      <a href="/pages/chinh-sach-thanh-toan" title="Chính sách thanh toán">
                        Chính sách thanh toán
                      </a>
                    </li>
                    <li className="item">
                      <a href="/pages/chinh-sach-van-chuyen" title="Chính sách vận chuyển">
                        Chính sách vận chuyển
                      </a>
                    </li>
                    <li className="item">
                      <a href="/pages/chinh-sach-doi-tra" title="Chính sách đổi trả">
                        Chính sách đổi trả
                      </a>
                    </li>
                    <li className="item">
                      <a href="/pages/chinh-sach-bao-mat" title="Chính sách bảo mật">
                        Chính sách bảo mật
                      </a>
                    </li>
                    <li className="item">
                      <a href="/pages/chuong-trinh-the-vip" title="Chương trình thẻ VIP">
                        Chương trình thẻ VIP
                      </a>
                    </li>
                    <li className="item">
                      <a href="/pages/huong-dan-chon-size" title="Hướng dẫn chọn size">
                        Hướng dẫn chọn size
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-6 col-md-12 col-12 widget-footer widget-footer-newsletter">
                <h2 className="widget-footer__title">Đăng ký nhận tin</h2>
                <div className="widget-footer__content block-collapse">
                  <p>Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông tin giảm giá khác.</p>
                  <div className="newsletter-content newsletter-form">
                    <form acceptCharset="UTF-8" className="contact-form">
                      <input name="form_type" type="hidden" defaultValue="customer" />
                      <input name="utf8" type="hidden" defaultValue="✓" />
                      <div className="form-group input-group">
                        <span className="icon-email">
                          <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 512 512">
                            <g>
                              <g>
                                <g>
                                  <path
                                    d="M485.743,85.333H26.257C11.815,85.333,0,97.148,0,111.589V400.41c0,14.44,11.815,26.257,26.257,26.257h459.487 c14.44,0,26.257-11.815,26.257-26.257V111.589C512,97.148,500.185,85.333,485.743,85.333z M475.89,105.024L271.104,258.626 c-3.682,2.802-9.334,4.555-15.105,4.529c-5.77,0.026-11.421-1.727-15.104-4.529L36.109,105.024H475.89z M366.5,268.761 l111.59,137.847c0.112,0.138,0.249,0.243,0.368,0.368H33.542c0.118-0.131,0.256-0.23,0.368-0.368L145.5,268.761 c3.419-4.227,2.771-10.424-1.464-13.851c-4.227-3.419-10.424-2.771-13.844,1.457l-110.5,136.501V117.332l209.394,157.046 c7.871,5.862,17.447,8.442,26.912,8.468c9.452-0.02,19.036-2.6,26.912-8.468l209.394-157.046v275.534L381.807,256.367 c-3.42-4.227-9.623-4.877-13.844-1.457C363.729,258.329,363.079,264.534,366.5,268.761z"
                                    fill="currentColor"
                                    data-original="currentColor"
                                  />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </span>
                        <input
                          type="hidden"
                          id="newsletter-tags"
                          name="contact[tags]"
                          defaultValue="Đăng kí nhận tin"
                        />
                        <input
                          type="email"
                          name="contact[email]"
                          className="form-control newsletter-input"
                          id="newsletter-email"
                          pattern="[Link-z0-9._%+-]+@[Link-z0-9.-]+\.[Link-z]{2,4}$"
                          placeholder="Nhập email của bạn"
                          aria-label="Email Address"
                        />
                        <span className="input-group-btn">
                          <button type="submit" className="button newsletter-btn">
                            Đăng ký
                          </button>
                        </span>
                      </div>
                    </form>
                    <p className="newsletter-error" />
                  </div>
                  <ul className="footerNav-social">
                    <li>
                      <Link
                        to="https://www.facebook.com/profile.php?id=100045761117043"
                        target="_blank"
                        rel="noopener"
                        title="Facebook"
                        aria-label="Facebook"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 155.139 155.139">
                          <g>
                            <g>
                              <path d="M89.584,155.139V84.378h23.742l3.562-27.585H89.584V39.184 c0-7.984,2.208-13.425,13.67-13.425l14.595-0.006V1.08C115.325,0.752,106.661,0,96.577,0C75.52,0,61.104,12.853,61.104,36.452 v20.341H37.29v27.585h23.814v70.761H89.584z" />
                            </g>
                          </g>
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="https://www.instagram.com"
                        target="_blank"
                        rel="noopener"
                        title="Instagram"
                        aria-label="Instagram"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={22}
                          viewBox="0 0 512.00096 512.00096"
                        >
                          <g>
                            <path d="m373.40625 0h-234.8125c-76.421875 0-138.59375 62.171875-138.59375 138.59375v234.816406c0 76.417969 62.171875 138.589844 138.59375 138.589844h234.816406c76.417969 0 138.589844-62.171875 138.589844-138.589844v-234.816406c0-76.421875-62.171875-138.59375-138.59375-138.59375zm108.578125 373.410156c0 59.867188-48.707031 108.574219-108.578125 108.574219h-234.8125c-59.871094 0-108.578125-48.707031-108.578125-108.574219v-234.816406c0-59.871094 48.707031-108.578125 108.578125-108.578125h234.816406c59.867188 0 108.574219 48.707031 108.574219 108.578125zm0 0" />
                            <path d="m256 116.003906c-77.195312 0-139.996094 62.800782-139.996094 139.996094s62.800782 139.996094 139.996094 139.996094 139.996094-62.800782 139.996094-139.996094-62.800782-139.996094-139.996094-139.996094zm0 249.976563c-60.640625 0-109.980469-49.335938-109.980469-109.980469 0-60.640625 49.339844-109.980469 109.980469-109.980469 60.644531 0 109.980469 49.339844 109.980469 109.980469 0 60.644531-49.335938 109.980469-109.980469 109.980469zm0 0" />
                            <path d="m399.34375 66.285156c-22.8125 0-41.367188 18.558594-41.367188 41.367188 0 22.8125 18.554688 41.371094 41.367188 41.371094s41.371094-18.558594 41.371094-41.371094-18.558594-41.367188-41.371094-41.367188zm0 52.71875c-6.257812 0-11.351562-5.09375-11.351562-11.351562 0-6.261719 5.09375-11.351563 11.351562-11.351563 6.261719 0 11.355469 5.089844 11.355469 11.351563 0 6.257812-5.09375 11.351562-11.355469 11.351562zm0 0" />
                          </g>
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="https://www.tiktok.com/"
                        target="_blank"
                        rel="noopener"
                        title="TikTok"
                        aria-label="TikTok"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 512 512">
                          <g>
                            <g>
                              <path d="m480.32 128.39c-29.22 0-56.18-9.68-77.83-26.01-24.83-18.72-42.67-46.18-48.97-77.83-1.56-7.82-2.4-15.89-2.48-24.16h-83.47v228.08l-.1 124.93c0 33.4-21.75 61.72-51.9 71.68-8.75 2.89-18.2 4.26-28.04 3.72-12.56-.69-24.33-4.48-34.56-10.6-21.77-13.02-36.53-36.64-36.93-63.66-.63-42.23 33.51-76.66 75.71-76.66 8.33 0 16.33 1.36 23.82 3.83v-62.34-22.41c-7.9-1.17-15.94-1.78-24.07-1.78-46.19 0-89.39 19.2-120.27 53.79-23.34 26.14-37.34 59.49-39.5 94.46-2.83 45.94 13.98 89.61 46.58 121.83 4.79 4.73 9.82 9.12 15.08 13.17 27.95 21.51 62.12 33.17 98.11 33.17 8.13 0 16.17-.6 24.07-1.77 33.62-4.98 64.64-20.37 89.12-44.57 30.08-29.73 46.7-69.2 46.88-111.21l-.43-186.56c14.35 11.07 30.04 20.23 46.88 27.34 26.19 11.05 53.96 16.65 82.54 16.64v-60.61-22.49c.02.02-.22.02-.24.02z" />
                            </g>
                          </g>
                        </svg>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="https://www.youtube.com/"
                        target="_blank"
                        rel="noopener"
                        title="Youtube"
                        aria-label="Youtube"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 409.592 409.592">
                          <g>
                            <g>
                              <g>
                                <path d="M403.882,107.206c-2.15-17.935-19.052-35.133-36.736-37.437c-107.837-13.399-216.883-13.399-324.685,0 C24.762,72.068,7.86,89.271,5.71,107.206c-7.613,65.731-7.613,129.464,0,195.18c2.15,17.935,19.052,35.149,36.751,37.437 c107.802,13.399,216.852,13.399,324.685,0c17.684-2.284,34.586-19.502,36.736-37.437 C411.496,236.676,411.496,172.937,403.882,107.206z M170.661,273.074V136.539l102.4,68.27L170.661,273.074z" />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright text-center">
            <div className="container">
              <p>
                Copyright © 2023 <Link to="https://www.facebook.com/profile.php?id=100045761117043"> Online Shop</Link>.
                <Link target="_blank" to="https://www.facebook.com/profile.php?id=100045761117043" rel="noreferrer">
                  Powered by DATN
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
