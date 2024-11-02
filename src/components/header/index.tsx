import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import { RootState } from '~/redux/reducers';
import Images from '~/static';
import './styles.css';
import { Order, OrderItem } from '~/types/order.type';
import cartApi from '~/apis/cart.apis';
import { Category } from '~/types/category.type';
import categoryApi from '~/apis/category.apis';
import productApi from '~/apis/product.apis';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.AuthReducer.user);
  const cart: Order[] = useSelector((state: RootState) => state.CartReducer.cart);
  const [cartItem, setCartItem] = React.useState<OrderItem[]>([]);
  // const [category, setCategory] = React.useState<Category[]>([]);
  const [category1, setCategory1] = React.useState<Category[]>([]);
  const [category2, setCategory2] = React.useState<Category[]>([]);
  const [showMenu, setShowMenu] = React.useState(false);
  const [searchLaptop, setSearchLaptop] = React.useState(false);
  const [searchMoblie, setSearchMobile] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const getCategory = async (id: number) => {
    try {
      const res = await categoryApi.getCategoryParent(id);
      if (res.data.status) {
        const category = res.data.data;
        if (id === 28) {
          setCategory1(category);
        } else if (id === 29) {
          setCategory2(category);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getCategory(28);
    getCategory(29);
  }, []);
  const handleUser = () => {
    if (!!user && user !== null) {
      navigate(path.profile);
    } else {
      navigate(path.login);
    }
  };
  const getCart = async () => {
    if (user) {
      try {
        const res = await cartApi.getCart(user.id);
        if (res.data.status) {
          // setCarts(res.data.data);
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
  }, [cart]);
  const handleSearch = () => {
    if (keyword !== '') {
      navigate(path.searchProduct, { state: keyword });
      setKeyword('');
      setSearchLaptop(false);
      setSearchMobile(false);
    }
  };
  const category: Category[] = [...category1, ...category2];
  React.useEffect(() => {
    setShowMenu(false);
    setSearchLaptop(false);
    setSearchMobile(false);
  }, [pathname]);
  return (
    <>
      <header className="mainHeader--height" style={{ minHeight: 74 }}>
        <div className="mainHeader mainHeader_temp01" id="main-header">
          <div className="mainHeader-middle">
            <div className="container">
              <div className="flex-container-header">
                <div className="header-wrap-iconav header-wrap-actions">
                  <div className="header-action">
                    <div className="header-action-item header-action_menu js-act-sitenav">
                      <div className="header-action_text">
                        {/* iconmenu */}
                        <button
                          className="header-action__link"
                          id="site-menu-handle"
                          aria-label="Menu"
                          title="Menu"
                          onClick={() => setShowMenu(true)}
                        >
                          <svg
                            width="20px"
                            height="20px"
                            fill="currentColor"
                            stroke="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M442 114H6a6 6 0 0 1-6-6V84a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6zm0 160H6a6 6 0 0 1-6-6v-24a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6zm0 160H6a6 6 0 0 1-6-6v-24a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* logo */}
                <div className="header-wrap-logo">
                  <div className="wrap-logo" onClick={() => navigate('/')}>
                    <a href="#">
                      <img
                        src={Images.logo}
                        alt="CRKing7"
                        className="img-responsive logoimg ls-is-cached lazyloaded"
                        style={{ width: '150px' }}
                      />
                    </a>
                  </div>
                </div>
                {/* menu */}
                <div className="header-wrap-menu">
                  <nav className="navbar-mainmenu">
                    <ul className="menuList-main">
                      <li className="has-submenu active ">
                        <Link to={path.home} title="Trang chủ">
                          Trang chủ
                        </Link>
                      </li>
                      <li className="has-submenu  fullwidth">
                        <a onClick={() => navigate(path.product, { state: { categoryId: 28 } })} title="Áo nam">
                          Áo nam
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={12}
                            height={12}
                            x={0}
                            y={0}
                            viewBox="0 0 128 128"
                          >
                            <g>
                              <path d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z" />
                            </g>
                          </svg>
                        </a>
                        <div className="menuList-submain multicolumn">
                          <div className="multicolumn-container">
                            <div className="subchildmenu  d-flex flex-wrap">
                              {!!category1 &&
                                !!category1.length &&
                                category1.map((item, i) => {
                                  return (
                                    <div className="ui-menu-item has-submenu col-lg-3" key={i}>
                                      <a
                                        className="cursor-pointer"
                                        title={item.title}
                                        onClick={() => navigate(path.product, { state: { categoryId: item.id } })}
                                      >
                                        {item.title}
                                      </a>
                                      <ul className="subchildmenu-item">
                                        {!!item.childCategories &&
                                          !!item.childCategories.length &&
                                          item.childCategories.map((child, index) => {
                                            return (
                                              <li className="" key={index}>
                                                <a
                                                  className="cursor-pointer"
                                                  title={child.title}
                                                  onClick={() =>
                                                    navigate(path.product, { state: { categoryId: child.id } })
                                                  }
                                                >
                                                  {child.title}
                                                </a>
                                              </li>
                                            );
                                          })}
                                      </ul>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="menuBanner">
                              <a href="collections/ao-nam">
                                <img
                                  className=" lazyloaded"
                                  src="//theme.hstatic.net/200000690725/1001078549/14/mega_menu_3_img.jpg?v=169"
                                  data-src="//theme.hstatic.net/200000690725/1001078549/14/mega_menu_3_img.jpg?v=169"
                                  alt="Áo nam"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="has-submenu  fullwidth">
                        <a
                          className="cursor-pointer"
                          title="Quần nam"
                          onClick={() => navigate(path.product, { state: { categoryId: 29 } })}
                        >
                          Quần nam
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={12}
                            height={12}
                            x={0}
                            y={0}
                            viewBox="0 0 128 128"
                          >
                            <g>
                              <path d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z" />
                            </g>
                          </svg>
                        </a>
                        <div className="menuList-submain multicolumn">
                          <div className="multicolumn-container">
                            <div className="subchildmenu  d-flex flex-wrap">
                              {!!category2 &&
                                !!category2.length &&
                                category2.map((item, i) => {
                                  return (
                                    <div className="ui-menu-item has-submenu col-lg-3" key={i}>
                                      <a
                                        className="cursor-pointer"
                                        title={item.title}
                                        onClick={() => navigate(path.product, { state: { categoryId: item.id } })}
                                      >
                                        {item.title}
                                      </a>
                                      <ul className="subchildmenu-item">
                                        {!!item.childCategories &&
                                          !!item.childCategories.length &&
                                          item.childCategories.map((child, index) => {
                                            return (
                                              <li className="" key={index}>
                                                <a
                                                  className="cursor-pointer"
                                                  title={child.title}
                                                  onClick={() =>
                                                    navigate(path.product, { state: { categoryId: child.id } })
                                                  }
                                                >
                                                  {child.title}
                                                </a>
                                              </li>
                                            );
                                          })}
                                      </ul>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="menuBanner">
                              <a href="collections/quan-nam">
                                <img
                                  className=" lazyloaded"
                                  src="//theme.hstatic.net/200000690725/1001078549/14/mega_menu_2_img.jpg?v=169"
                                  data-src="//theme.hstatic.net/200000690725/1001078549/14/mega_menu_2_img.jpg?v=169"
                                  alt="Quần nam"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="has-submenu  ">
                        <a onClick={() => navigate(path.product)} title="Sản phẩm" className="cursor-pointer">
                          Sản phẩm
                        </a>
                      </li>
                      <li className="has-submenu  ">
                        <a title="Bài viết" className="cursor-pointer" onClick={() => navigate(path.article)}>
                          Bài viết
                        </a>
                      </li>
                      <li className="">
                        <Link to={path.contact} title="Liên hệ">
                          Liên hệ
                        </Link>
                      </li>
                    </ul>
                  </nav>{' '}
                </div>
                {/* bên phải */}
                <div className="header-wrap-actions">
                  <div className="header-action">
                    {/* tìm kiểm laptop */}
                    <div className="header-action-item header-action_search search-desktop activeSearchChecked d-none d-lg-block">
                      <div className="header-action_text">
                        <button
                          className="header-action__link"
                          id="site-search-handle"
                          title="Tìm kiếm"
                          onClick={() => setSearchLaptop(true)}
                        >
                          <span className="box-icon">
                            <svg width={22} height={22} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.8438 19.3203C21.0781 19.5286 21.0781 19.75 20.8438 19.9844L19.9844 20.8438C19.75 21.0781 19.5286 21.0781 19.3203 20.8438L14.5938 16.1172C14.4896 16.013 14.4375 15.9089 14.4375 15.8047V15.2578C12.901 16.5859 11.1302 17.25 9.125 17.25C6.88542 17.25 4.97135 16.4557 3.38281 14.8672C1.79427 13.2786 1 11.3646 1 9.125C1 6.88542 1.79427 4.97135 3.38281 3.38281C4.97135 1.79427 6.88542 1 9.125 1C11.3646 1 13.2786 1.79427 14.8672 3.38281C16.4557 4.97135 17.25 6.88542 17.25 9.125C17.25 11.1302 16.5859 12.901 15.2578 14.4375H15.8047C15.9349 14.4375 16.0391 14.4896 16.1172 14.5938L20.8438 19.3203ZM4.71094 13.5391C5.9349 14.763 7.40625 15.375 9.125 15.375C10.8438 15.375 12.3151 14.763 13.5391 13.5391C14.763 12.3151 15.375 10.8438 15.375 9.125C15.375 7.40625 14.763 5.9349 13.5391 4.71094C12.3151 3.48698 10.8438 2.875 9.125 2.875C7.40625 2.875 5.9349 3.48698 4.71094 4.71094C3.48698 5.9349 2.875 7.40625 2.875 9.125C2.875 10.8438 3.48698 12.3151 4.71094 13.5391Z" />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                    {/* tìm kiểm mobile */}
                    <div
                      className={`header-action-item header-action_search search-mobile d-block d-lg-none ${
                        searchMoblie ? 'js-action-show' : ''
                      }`}
                    >
                      <div className="header-action_text">
                        <button
                          className="header-action__link header-action_clicked"
                          title="Tìm kiếm"
                          onClick={() => setSearchMobile(!searchMoblie)}
                        >
                          <span className="box-icon">
                            <svg width={22} height={22} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.8438 19.3203C21.0781 19.5286 21.0781 19.75 20.8438 19.9844L19.9844 20.8438C19.75 21.0781 19.5286 21.0781 19.3203 20.8438L14.5938 16.1172C14.4896 16.013 14.4375 15.9089 14.4375 15.8047V15.2578C12.901 16.5859 11.1302 17.25 9.125 17.25C6.88542 17.25 4.97135 16.4557 3.38281 14.8672C1.79427 13.2786 1 11.3646 1 9.125C1 6.88542 1.79427 4.97135 3.38281 3.38281C4.97135 1.79427 6.88542 1 9.125 1C11.3646 1 13.2786 1.79427 14.8672 3.38281C16.4557 4.97135 17.25 6.88542 17.25 9.125C17.25 11.1302 16.5859 12.901 15.2578 14.4375H15.8047C15.9349 14.4375 16.0391 14.4896 16.1172 14.5938L20.8438 19.3203ZM4.71094 13.5391C5.9349 14.763 7.40625 15.375 9.125 15.375C10.8438 15.375 12.3151 14.763 13.5391 13.5391C14.763 12.3151 15.375 10.8438 15.375 9.125C15.375 7.40625 14.763 5.9349 13.5391 4.71094C12.3151 3.48698 10.8438 2.875 9.125 2.875C7.40625 2.875 5.9349 3.48698 4.71094 4.71094C3.48698 5.9349 2.875 7.40625 2.875 9.125C2.875 10.8438 3.48698 12.3151 4.71094 13.5391Z" />
                            </svg>
                            <span className="box-icon--close">
                              <svg viewBox="0 0 19 19" role="presentation">
                                <path
                                  d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </span>
                          </span>
                        </button>
                        <span className="box-triangle">
                          <svg viewBox="0 0 20 9" role="presentation">
                            <path
                              d="M.47108938 9c.2694725-.26871321.57077721-.56867841.90388257-.89986354C3.12384116 6.36134886 5.74788116 3.76338565 9.2467995.30653888c.4145057-.4095171 1.0844277-.40860098 1.4977971.00205122L19.4935156 9H.47108938z"
                              fill="#ffffff"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="header-action_dropdown">
                        <div className="header-dropdown_content">
                          <div className="sitenav-content sitenav-search">
                            <p className="boxtitle">Tìm kiếm</p>
                            <div className="search-box wpo-wrapper-search">
                              <div className="searchform searchform-categoris ultimate-search">
                                <div className="wpo-search-inner">
                                  <input
                                    id="inputSearchAuto-mb"
                                    className="input-search"
                                    name="q"
                                    maxLength={40}
                                    autoComplete="off"
                                    type="text"
                                    size={20}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                  />
                                </div>
                                <div
                                  className="btn-search btn cursor-pointor"
                                  id="search-header-btn"
                                  onClick={handleSearch}
                                >
                                  <svg
                                    version="1.1"
                                    className="svg search"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 24 27"
                                    xmlSpace="preserve"
                                  >
                                    <path d="M10,2C4.5,2,0,6.5,0,12s4.5,10,10,10s10-4.5,10-10S15.5,2,10,2z M10,19c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S13.9,19,10,19z" />
                                    <rect
                                      x={17}
                                      y={17}
                                      transform="matrix(0.7071 -0.7071 0.7071 0.7071 -9.2844 19.5856)"
                                      width={4}
                                      height={8}
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="smart-search-wrapper ajaxSearchResults">
                                <div className="resultsContent" />
                                <div className="search-suggest">
                                  <ul>
                                    <li className="item item-suggest">Gợi ý cho bạn:</li>
                                    {!!category &&
                                      !!category.length &&
                                      category.map((item, i) => (
                                        <li className="item" key={i}>
                                          <a
                                            className="cursor-pointor"
                                            onClick={() => navigate(path.product, { state: { categoryId: item.id } })}
                                            title={item.title}
                                          >
                                            {item.title},
                                          </a>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* user */}
                    <div className="header-action-item header-action_account">
                      <div className="header-action_text">
                        <button
                          className="header-action__link  header-action_clicked "
                          title="Tài khoản"
                          onClick={handleUser}
                        >
                          <span className="box-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22">
                              <path d="M14.5156 12.875C15.9479 12.875 17.1719 13.3958 18.1875 14.4375C19.2292 15.4531 19.75 16.6771 19.75 18.1094V19.125C19.75 19.6458 19.5677 20.0885 19.2031 20.4531C18.8385 20.8177 18.3958 21 17.875 21H4.125C3.60417 21 3.16146 20.8177 2.79688 20.4531C2.43229 20.0885 2.25 19.6458 2.25 19.125V18.1094C2.25 16.6771 2.75781 15.4531 3.77344 14.4375C4.8151 13.3958 6.05208 12.875 7.48438 12.875C7.82292 12.875 8.31771 12.9792 8.96875 13.1875C9.64583 13.3958 10.3229 13.5 11 13.5C11.6771 13.5 12.3542 13.3958 13.0312 13.1875C13.7083 12.9792 14.2031 12.875 14.5156 12.875ZM17.875 19.125V18.1094C17.875 17.1979 17.5365 16.4167 16.8594 15.7656C16.2083 15.0885 15.4271 14.75 14.5156 14.75C14.4375 14.75 14.0208 14.8542 13.2656 15.0625C12.5365 15.2708 11.7812 15.375 11 15.375C10.2188 15.375 9.45052 15.2708 8.69531 15.0625C7.96615 14.8542 7.5625 14.75 7.48438 14.75C6.57292 14.75 5.77865 15.0885 5.10156 15.7656C4.45052 16.4167 4.125 17.1979 4.125 18.1094V19.125H17.875ZM14.9844 10.6094C13.8906 11.7031 12.5625 12.25 11 12.25C9.4375 12.25 8.10938 11.7031 7.01562 10.6094C5.92188 9.51562 5.375 8.1875 5.375 6.625C5.375 5.0625 5.92188 3.73438 7.01562 2.64062C8.10938 1.54688 9.4375 1 11 1C12.5625 1 13.8906 1.54688 14.9844 2.64062C16.0781 3.73438 16.625 5.0625 16.625 6.625C16.625 8.1875 16.0781 9.51562 14.9844 10.6094ZM13.6562 3.96875C12.9271 3.23958 12.0417 2.875 11 2.875C9.95833 2.875 9.07292 3.23958 8.34375 3.96875C7.61458 4.69792 7.25 5.58333 7.25 6.625C7.25 7.66667 7.61458 8.55208 8.34375 9.28125C9.07292 10.0104 9.95833 10.375 11 10.375C12.0417 10.375 12.9271 10.0104 13.6562 9.28125C14.3854 8.55208 14.75 7.66667 14.75 6.625C14.75 5.58333 14.3854 4.69792 13.6562 3.96875Z" />
                            </svg>
                            <span className="box-icon--close">
                              <svg viewBox="0 0 19 19" role="presentation">
                                <path
                                  d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </span>
                          </span>
                        </button>
                        <span className="box-triangle">
                          <svg viewBox="0 0 20 9" role="presentation">
                            <path
                              d="M.47108938 9c.2694725-.26871321.57077721-.56867841.90388257-.89986354C3.12384116 6.36134886 5.74788116 3.76338565 9.2467995.30653888c.4145057-.4095171 1.0844277-.40860098 1.4977971.00205122L19.4935156 9H.47108938z"
                              fill="#ffffff"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                    {/* giỏ hàng */}
                    <div className="header-action-item header-action_cart js-sitenav-cart js-act-sitenav">
                      <div className="header-action_text">
                        <button
                          className="header-action__link"
                          id="site-cart-handle"
                          aria-label="Giỏ hàng"
                          title="Giỏ hàng"
                          onClick={() => navigate(path.cart)}
                        >
                          <span className="box-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22">
                              <path d="M15.95 6H19.7V17.875C19.7 18.7344 19.3875 19.4635 18.7625 20.0625C18.1635 20.6875 17.4344 21 16.575 21H5.325C4.46563 21 3.72344 20.6875 3.09844 20.0625C2.49948 19.4635 2.2 18.7344 2.2 17.875V6H5.95C5.95 4.61979 6.43177 3.44792 7.39531 2.48438C8.3849 1.49479 9.56979 1 10.95 1C12.3302 1 13.5021 1.49479 14.4656 2.48438C15.4552 3.44792 15.95 4.61979 15.95 6ZM13.1375 3.8125C12.5385 3.1875 11.8094 2.875 10.95 2.875C10.0906 2.875 9.34844 3.1875 8.72344 3.8125C8.12448 4.41146 7.825 5.14062 7.825 6H14.075C14.075 5.14062 13.7625 4.41146 13.1375 3.8125ZM17.825 17.875V7.875H15.95V9.4375C15.95 9.69792 15.8589 9.91927 15.6766 10.1016C15.4943 10.2839 15.2729 10.375 15.0125 10.375C14.7521 10.375 14.5307 10.2839 14.3484 10.1016C14.1661 9.91927 14.075 9.69792 14.075 9.4375V7.875H7.825V9.4375C7.825 9.69792 7.73385 9.91927 7.55156 10.1016C7.36927 10.2839 7.14792 10.375 6.8875 10.375C6.62708 10.375 6.40573 10.2839 6.22344 10.1016C6.04115 9.91927 5.95 9.69792 5.95 9.4375V7.875H4.075V17.875C4.075 18.2135 4.19219 18.5 4.42656 18.7344C4.68698 18.9948 4.98646 19.125 5.325 19.125H16.575C16.9135 19.125 17.2 18.9948 17.4344 18.7344C17.6948 18.5 17.825 18.2135 17.825 17.875Z" />
                            </svg>
                            <span className="box-icon--close">
                              <svg viewBox="0 0 19 19" role="presentation">
                                <path
                                  d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </span>
                            <span className="count-holder">
                              <span className="count">
                                {/* {cart.length !== cartItem.length ? `${cartItem.length}` : `${cart.length}`} */}
                                {cartItem.length}
                              </span>
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="sidebar-main">
        {showMenu && (
          <div className="sitenav-wrapper sitenav-left sitenav-menu js-ajax-menu is-opened" id="js-sitenav-menu">
            <div className="sitenav-inner">
              <div className="sitenav-header">
                <p className="sitenav-header__title">Danh mục</p>
                <a className="sitenav-header__btn btn-sitenav-close" onClick={() => setShowMenu(false)}>
                  <svg viewBox="0 0 19 19" role="presentation">
                    <path
                      d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div className="sitenav-content">
                <div className="menu-mobile--wrap ajax-render-mainmenu">
                  <ul className="menuList-links">
                    <li className="">
                      <a title="Trang chủ" onClick={() => navigate(path.home)}>
                        <span>Trang chủ</span>
                      </a>
                    </li>
                    <li
                      className="has-submenu level0 "
                      onClick={() => navigate(path.product, { state: { categoryId: 28 } })}
                    >
                      <a title="Áo name">Áo nam</a>
                    </li>
                    <li className="">
                      <a title="Quần nam" onClick={() => navigate(path.product, { state: { categoryId: 29 } })}>
                        <span>Quần nam</span>
                      </a>
                    </li>
                    <li className="">
                      <a title="Sản phẩm" onClick={() => navigate(path.product)}>
                        <span>Sản phẩm</span>
                      </a>
                    </li>
                    <li className="">
                      <a title="Bài viết" onClick={() => navigate(path.article)}>
                        <span>Bài viết</span>
                      </a>
                    </li>
                    <li className="has-submenu level0 " onClick={() => navigate(path.contact)}>
                      <a title="Liên hệ">Liên hệ</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sitenav-footer">
                <div className="mobile-menu__section mobile-menu__section--loose">
                  <p className="mobile-menu__section-title">Bạn cần hỗ trợ?</p>
                  <div className="mobile-menu__help-wrapper">
                    <svg className="icon icon--bi-phone" viewBox="0 0 24 24" role="presentation">
                      <g strokeWidth={2} fill="none" fillRule="evenodd" strokeLinecap="square">
                        <path d="M17 15l-3 3-8-8 3-3-5-5-3 3c0 9.941 8.059 18 18 18l3-3-5-5z" stroke="#121212" />
                        <path d="M14 1c4.971 0 9 4.029 9 9m-9-5c2.761 0 5 2.239 5 5" stroke="#121212" />
                      </g>
                    </svg>
                    <a href="tel:0966821574" rel="nofollow">
                      0966821574
                    </a>
                  </div>
                  <div className="mobile-menu__help-wrapper">
                    <svg className="icon icon--bi-email" viewBox="0 0 22 22" role="presentation">
                      <g fill="none" fillRule="evenodd">
                        <path
                          stroke="#121212"
                          d="M.916667 10.08333367l3.66666667-2.65833334v4.65849997zm20.1666667 0L17.416667 7.42500033v4.65849997z"
                        />
                        <path
                          stroke="#121212"
                          strokeWidth={2}
                          d="M4.58333367 7.42500033L.916667 10.08333367V21.0833337h20.1666667V10.08333367L17.416667 7.42500033"
                        />
                        <path
                          stroke="#121212"
                          strokeWidth={2}
                          d="M4.58333367 12.1000003V.916667H17.416667v11.1833333m-16.5-2.01666663L21.0833337 21.0833337m0-11.00000003L11.0000003 15.5833337"
                        />
                        <path
                          d="M8.25000033 5.50000033h5.49999997M8.25000033 9.166667h5.49999997"
                          stroke="#121212"
                          strokeWidth={2}
                          strokeLinecap="square"
                        />
                      </g>
                    </svg>
                    <a href="mailto:crking7dev@gmail.com" rel="nofollow">
                      crking7dev@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* sreach laptop */}
      {searchLaptop && (
        <div className="sidebar-search show">
          <div className="sitenav-search">
            <div className="mini_search_header">
              <h3 className="d-sm-block d-lg-none">Tìm kiếm </h3>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-lg-3 logo">
                  <div className="wrap-logo" onClick={() => navigate('/')}>
                    <a href="#">
                      <img
                        src={Images.logo}
                        alt="CRKing7"
                        className="img-responsive logoimg ls-is-cached lazyloaded"
                        style={{ width: '150px' }}
                      />
                    </a>
                  </div>
                </div>
                <div className="col-lg-6 search-form wpo-wrapper-search">
                  <div className="searchform searchform-categoris ultimate-search">
                    <div className="wpo-search-inner">
                      <input
                        id="inputSearchAuto"
                        className="input-search"
                        maxLength={40}
                        autoComplete="off"
                        type="text"
                        size={20}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                    <div className="btn-search btn cursor-pointor" aria-label="button search" onClick={handleSearch}>
                      <svg
                        version="1.1"
                        className="svg search"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 24 27"
                        style={{ enableBackground: 'new 0 0 24 27' }}
                        xmlSpace="preserve"
                      >
                        <path d="M10,2C4.5,2,0,6.5,0,12s4.5,10,10,10s10-4.5,10-10S15.5,2,10,2z M10,19c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7S13.9,19,10,19z" />
                        <rect
                          x={17}
                          y={17}
                          transform="matrix(0.7071 -0.7071 0.7071 0.7071 -9.2844 19.5856)"
                          width={4}
                          height={8}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 actions">
                  <div className="btn-close-search" onClick={() => setSearchLaptop(false)} />
                </div>
              </div>
            </div>
          </div>
          <div className="overlay" />
        </div>
      )}
    </>
  );
};

export default Header;
