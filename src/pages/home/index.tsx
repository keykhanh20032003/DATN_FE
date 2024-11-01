import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import homeApi from '~/apis/home.apis';
import { Banner, Category } from '~/types/category.type';
import { API_URL_IMAGE } from '~/constants/utils';
import './styles.css';
import { toast } from 'react-toastify';
import SwiperCore from 'swiper/core';
import categoryApi from '~/apis/category.apis';
import { Link, useNavigate } from 'react-router-dom';
import productApi from '~/apis/product.apis';
import { Product } from '~/types/product.type';
import ItemProduct from '~/components/product';
import { Sale } from '~/types/sale.type';
import saleApi from '~/apis/sale.apis';
import articleApi from '~/apis/article.apis';
import { Article } from '~/types/article.type';
import { formatDateString } from '~/constants/formatDate';
import path from '~/constants/path';

SwiperCore.use([Navigation]);
const Home = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = React.useState<Banner[]>([]);
  const [productBestSeller, setProductBestSeller] = React.useState<Product[]>([]);
  //PBS === productBestSeller
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [salesColection, setSalesColection] = React.useState<Sale[]>([]);
  const [salesProduct, setSalesProduct] = React.useState<Sale[]>([]);

  const getSlideHome = async () => {
    try {
      const res = await homeApi.getSlideHome();
      if (res.data.status) {
        setSlide(res.data.data);
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
    getSlideHome();
  }, []);
  //getcategory
  const [category1, setCategory1] = React.useState<Category[]>([]);

  const [category2, setCategory2] = React.useState<Category[]>([]);
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
  const category: Category[] = [...category1, ...category2];

  React.useEffect(() => {
    getCategory(28);
    getCategory(29);
  }, []);
  // swiper
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [swiper, setSwiper] = React.useState(null);
  const totalSlides = category.length;
  const setSwiperRef = (ref) => {
    setSwiper(ref);
  };
  const handlePrevClick = () => {
    if (activeSlide > 0) {
      if (swiper && activeSlide - 1 >= 0) {
        setActiveSlide(activeSlide - 1);
        swiper.slidePrev();
      }
    }
  };

  const handleNextClick = () => {
    if (activeSlide < totalSlides - 1) {
      if (swiper && activeSlide + 1 < totalSlides - 3) {
        setActiveSlide(activeSlide + 1);
        swiper.slideNext();
      }
    }
  };

  //getProductBestSeller
  const getProBestSeller = async () => {
    try {
      const res = await productApi.getBestSellerProduct();
      if (res.data.status) {
        const productBestSeller = res.data.data.data;
        setProductBestSeller(productBestSeller);
      } else {
        toast.error(`${res.data.data.data}`, {
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
    getProBestSeller();
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
        setSalesColection((prevMapping) => ({
          ...prevMapping,
          [sale.id]: sale.discount,
        }));
        setSalesProduct((prevMapping) => ({
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
  React.useEffect(() => {
    if (productBestSeller.length > 0) {
      productBestSeller.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0) {
          await getSale(item.sale);
        }
      });
    }
  }, [productBestSeller]);
  //productColection
  const [activeTab, setActiveTab] = React.useState<number | null>();
  const [activeCategoryId, setActiveCategoryId] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (category.length > 0) {
      if (activeCategoryId === null || !category.find((item) => item.id === activeCategoryId)) {
        setActiveCategoryId(1);
      }
    }
  }, [category]);

  React.useEffect(() => {
    if (activeCategoryId !== null) {
      setActiveTab(activeCategoryId);
    }
  }, [activeCategoryId]);

  const handleTabClick = (tabIndex) => {
    setActiveCategoryId(tabIndex);
  };
  const [productColection, setProductColection] = React.useState<Product[]>([]);
  const getProduct = async (id: number) => {
    try {
      const res = await productApi.getProductByCategory(id);
      if (res.data.status) {
        setProductColection(res.data.data);
      } else {
        setProductColection([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    if (!!activeTab) {
      getProduct(activeTab);
    }
  }, [activeTab]);
  React.useEffect(() => {
    if (productColection.length > 0) {
      productColection.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0) {
          await getSale(item.sale);
        }
      });
    }
  }, [productColection]);
  //article
  const [activeSlideArticle, setActiveSlideArticle] = React.useState(0);
  const [swiperArticle, setSwiperArticle] = React.useState(null);
  const [article, setArticle] = React.useState<Article[]>([]);
  const totalSlidesArticle = article.length;
  const setSwiperRefArticle = (ref) => {
    setSwiperArticle(ref);
  };
  const handlePrevClickArticle = () => {
    if (activeSlideArticle > 0) {
      if (swiperArticle && activeSlideArticle - 1 >= 0) {
        setActiveSlideArticle(activeSlideArticle - 1);
        swiperArticle.slidePrev();
      }
    }
  };
  const handleNextClickArticle = () => {
    if (activeSlideArticle < totalSlidesArticle - 1) {
      if (swiperArticle && activeSlideArticle + 1 < totalSlidesArticle - 3) {
        setActiveSlideArticle(activeSlideArticle + 1);
        swiperArticle.slideNext();
      }
    }
  };
  const getArticle = async () => {
    try {
      const res = await articleApi.getArticleHome();
      if (res.data.status) {
        setArticle(res.data.data);
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
    getArticle();
  }, []);
  //đếm ngược
  const [countdown, setCountdown] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  let countdownInterval;
  React.useEffect(() => {
    const targetDate = new Date('2023-12-24T10:00:00').getTime();
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const timeDifference = targetDate - now;

      if (timeDifference <= 0) {
        // Countdown has ended
        clearInterval(countdownInterval);
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      }
    };

    countdownInterval = setInterval(calculateCountdown, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);
  //sản phẩm khuyến mãi
  const [activeSlideSale, setActiveSlideSale] = React.useState(0);
  const [swiperSale, setSwiperSale] = React.useState(null);
  const [productSale, setProductSale] = React.useState<Product[]>([]);
  const totalSlidesSale = productSale.length;
  const setSwiperRefSale = (ref) => {
    setSwiperSale(ref);
  };
  const handlePrevClickSale = () => {
    if (activeSlideSale > 0) {
      if (swiperSale && activeSlideSale - 1 >= 0) {
        setActiveSlideSale(activeSlideSale - 1);
        swiperSale.slidePrev();
      }
    }
  };
  const handleNextClickSale = () => {
    if (activeSlideSale < totalSlidesSale - 1) {
      if (swiperSale && activeSlideSale + 1 < totalSlidesSale - 3) {
        setActiveSlideSale(activeSlideSale + 1);
        swiperSale.slideNext();
      }
    }
  };
  const getProductSale = async () => {
    try {
      const res = await productApi.productSale();
      if (res.data.status) {
        setProductSale(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getProductSale();
  }, []);
  React.useEffect(() => {
    if (productSale.length > 0) {
      productSale.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0) {
          await getSale(item.sale);
        }
      });
    }
  }, [productSale]);
  return (
    <>
      {/* banner */}
      <div className="section-home-slider">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="home-slider"
        >
          {!!slide &&
            !!slide.length &&
            slide.map((item, i) => {
              return (
                <SwiperSlide key={i} className="">
                  <img src={`${API_URL_IMAGE}${item.src}`} className="banner-home" />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
      {/* danh mục nổi bật */}
      <div className="section-home-category">
        <div className="container">
          <div className="section-title">
            <h2 className="text-start">
              <Link to={path.product}>Danh mục nổi bật</Link>
            </h2>{' '}
            <div className="swiper-nav">
              <span
                className={`swiper-button swiper-category-prev ${activeSlide === 0 ? 'swiper-button-disabled' : ''}`}
                role="button"
                tabIndex={-1}
                onClick={handlePrevClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 511.993 511.993">
                  <g>
                    <g>
                      <g>
                        <path d="M487.292,235.408H20.59c-11.372,0-20.59,9.224-20.59,20.59c0,11.366,9.217,20.59,20.59,20.59h466.702 c11.372,0,20.59-9.217,20.59-20.59C507.882,244.625,498.665,235.408,487.292,235.408z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M505.96,241.434L304.187,39.653c-8.044-8.037-21.07-8.037-29.114,0c-8.044,8.044-8.044,21.084,0,29.121l187.216,187.223 L275.073,443.221c-8.044,8.037-8.044,21.077,0,29.114c4.022,4.022,9.286,6.033,14.557,6.033s10.535-2.011,14.557-6.033	l201.773-201.78C514.004,262.511,514.004,249.47,505.96,241.434z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span
                className={`swiper-button swiper-category-next ${
                  activeSlide >= totalSlides - 4 ? 'swiper-button-disabled' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={handleNextClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 511.993 511.993">
                  <g>
                    <g>
                      <g>
                        <path d="M487.292,235.408H20.59c-11.372,0-20.59,9.224-20.59,20.59c0,11.366,9.217,20.59,20.59,20.59h466.702 c11.372,0,20.59-9.217,20.59-20.59C507.882,244.625,498.665,235.408,487.292,235.408z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M505.96,241.434L304.187,39.653c-8.044-8.037-21.07-8.037-29.114,0c-8.044,8.044-8.044,21.084,0,29.121l187.216,187.223 L275.073,443.221c-8.044,8.037-8.044,21.077,0,29.114c4.022,4.022,9.286,6.033,14.557,6.033s10.535-2.011,14.557-6.033	l201.773-201.78C514.004,262.511,514.004,249.47,505.96,241.434z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </div>
          </div>
          <div className="section-content">
            <Swiper
              onSwiper={setSwiperRef}
              slidesPerView={4}
              breakpoints={{
                0: {
                  slidesPerView: 1.4,
                  spaceBetween: 30,
                },
                760: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                990: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              spaceBetween={30}
              modules={[Navigation]}
              className="list-category-slide"
            >
              {!!category &&
                !!category.length &&
                category.map((item, i) => (
                  <SwiperSlide key={i} className="category-item">
                    <div
                      className="category-item__inner"
                      onClick={() => navigate(path.product, { state: { categoryId: item.id } })}
                    >
                      <div className="category-item__img boxlazy-img">
                        <div className="cursor-pointer">
                          <img className="swiper-lazy swiper-lazy-loaded" src={`${API_URL_IMAGE}${item.urlImage}`} />
                        </div>
                      </div>
                      <div className="category-item__info cursor-pointer">
                        <div className="info-title">
                          <h3>
                            <a className="cursor-pointer">{item.title}</a>
                          </h3>
                        </div>
                        <div className="info-icon">
                          <div className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22">
                              <g>
                                <path
                                  xmlns="http://www.w3.org/2000/svg"
                                  d="m4 13c-.26901 0-.50292-.0994-.70175-.2982-.19883-.1989-.29825-.4328-.29825-.7018 0-.2807.09942-.5146.29825-.7018.19883-.1988.43274-.2982.70175-.2982h16c.2807 0 .5146.0994.7018.2982.1988.1872.2982.4211.2982.7018 0 .269-.0994.5029-.2982.7018-.1872.1988-.4211.2982-.7018.2982zm9.7018 6.7018c-.1755.1988-.4094.2982-.7018.2982-.269 0-.5029-.0994-.7018-.2982-.1988-.1989-.2982-.4328-.2982-.7018 0-.2924.0994-.5263.2982-.7018l6.8948-6.8947c.0585-.0585.0994.0292.1228.2632.0234.2222.0234.4503 0 .6842-.0234.2222-.0643.3041-.1228.2456l-6.8948-6.89475c-.1988-.18713-.2982-.42105-.2982-.70175s.0994-.51462.2982-.70176c.1989-.19882.4328-.29824.7018-.29824.2924 0 .5263.09942.7018.29824l6.8947 6.89476c.2222.2105.3333.4795.3333.807 0 .3158-.1111.5848-.3333.807z"
                                />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
      {/* sản phẩm khuyến mãi */}
      <section className="section-home-collection collection-flashsale">
        <div className="container">
          <div className="section-title">
            <h2 className="text-start">
              <a className="cursor-pointer" onClick={() => navigate(path.product)}>
                Sản phẩm khuyến mãi
              </a>
            </h2>
            {/* đếm ngược  */}
            <div className="section-countdown flip-js-countdown countdown-show">
              <div
                className="auto-due soon"
                data-face="slot"
                data-format="d,h,m,s"
                data-labels-days="Dia,Ngày"
                data-labels-hours="Hora,Giờ"
                data-labels-minutes="Minuto,Phút"
                data-labels-seconds="Segundo,Giây"
                data-initialized="true"
                data-layout=" group"
                data-scale="m"
              >
                <span id="label-due" />
                <div id="soon-espa" />
                <span className="soon-group ">
                  <span className="soon-group-inner">
                    <span className="soon-group soon-group-sub">
                      <span className="soon-group-inner">
                        <span className="soon-slot-inner">{countdown.days}</span>
                        <span className="soon-text soon-label">Ngày</span>
                      </span>
                    </span>
                    <span className="soon-group soon-group-sub">
                      <span className="soon-group-inner">
                        <span className="soon-slot-inner">{countdown.hours}</span>
                        <span className="soon-text soon-label">Giờ</span>
                      </span>
                    </span>
                    <span className="soon-group soon-group-sub">
                      <span className="soon-group-inner">
                        <span className="soon-slot-inner">{countdown.minutes}</span>
                        <span className="soon-text soon-label">Phút</span>
                      </span>
                    </span>
                    <span className="soon-group soon-group-sub">
                      <span className="soon-group-inner">
                        <span className="soon-slot-inner">{countdown.seconds}</span>
                        <span className="soon-text soon-label">Giây</span>
                      </span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div className="swiper-nav">
              <span
                className={`swiper-button swiper-category-prev ${
                  activeSlideSale === 0 ? 'swiper-button-disabled' : ''
                }`}
                role="button"
                tabIndex={-1}
                onClick={handlePrevClickSale}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 511.993 511.993">
                  <g>
                    <g>
                      <g>
                        <path d="M487.292,235.408H20.59c-11.372,0-20.59,9.224-20.59,20.59c0,11.366,9.217,20.59,20.59,20.59h466.702 c11.372,0,20.59-9.217,20.59-20.59C507.882,244.625,498.665,235.408,487.292,235.408z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M505.96,241.434L304.187,39.653c-8.044-8.037-21.07-8.037-29.114,0c-8.044,8.044-8.044,21.084,0,29.121l187.216,187.223 L275.073,443.221c-8.044,8.037-8.044,21.077,0,29.114c4.022,4.022,9.286,6.033,14.557,6.033s10.535-2.011,14.557-6.033	l201.773-201.78C514.004,262.511,514.004,249.47,505.96,241.434z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span
                className={`swiper-button swiper-category-next ${
                  activeSlideSale >= totalSlidesSale - 6 ? 'swiper-button-disabled' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={handleNextClickSale}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 511.993 511.993">
                  <g>
                    <g>
                      <g>
                        <path d="M487.292,235.408H20.59c-11.372,0-20.59,9.224-20.59,20.59c0,11.366,9.217,20.59,20.59,20.59h466.702 c11.372,0,20.59-9.217,20.59-20.59C507.882,244.625,498.665,235.408,487.292,235.408z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M505.96,241.434L304.187,39.653c-8.044-8.037-21.07-8.037-29.114,0c-8.044,8.044-8.044,21.084,0,29.121l187.216,187.223 L275.073,443.221c-8.044,8.037-8.044,21.077,0,29.114c4.022,4.022,9.286,6.033,14.557,6.033s10.535-2.011,14.557-6.033	l201.773-201.78C514.004,262.511,514.004,249.47,505.96,241.434z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </div>
          </div>
          <div className="section-content">
            <Swiper
              onSwiper={setSwiperRefSale}
              slidesPerView={4}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                760: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                990: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                1200: {
                  slidesPerView: 6,
                  spaceBetween: 30,
                },
              }}
              spaceBetween={30}
              modules={[Navigation]}
              className="list-product-slide"
            >
              {!!productSale &&
                !!productSale.length &&
                productSale.map((item, i) => (
                  <SwiperSlide key={i} className="">
                    <ItemProduct
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      salePrice={item.salePrice}
                      img1={item.images[0].url}
                      img2={item.images[1].url}
                      sale={`${salesProduct[item.sale]}`}
                      slide={true}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
            <div className="see-more-product d-flex" onClick={() => navigate(path.product, { state: { saleId: 1 } })}>
              <a className="button btnlight btn-see-more cursor-pointer">
                Xem tất cả <strong>Sản phẩm khuyến mãi</strong>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* sản phẩm nổi bật */}
      <div className="section-home-collection collection-1-tabs collection-tabs">
        <div className="container">
          <div className="section-title">
            <div className="title-tabs__navigation">
              <ul className="nav tabs-navigation">
                <li className="nav-item tab-header">
                  <a className="tab-title nav-link active" onClick={() => navigate(path.product)}>
                    SẢN PHẨM NỔI BẬT
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="list-product-row row">
            {!!productBestSeller &&
              !!productBestSeller.length &&
              productBestSeller.map((item, i) => (
                <React.Fragment key={i}>
                  <ItemProduct
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    salePrice={item.salePrice}
                    img1={item.images[0].url}
                    img2={item.images[1].url}
                    sale={`${sales[item.sale]}`}
                    slide={false}
                  />
                </React.Fragment>
              ))}
          </div>
          <div className="see-more-product d-flex " onClick={() => navigate(path.product)}>
            <a className="button btnlight btn-see-more cursor-pointer">
              Xem tất cả <strong className="coll-title">SẢN PHẨM NỔI BẬT</strong>
            </a>
          </div>
        </div>
      </div>
      {/* home about us */}
      {/* <div id="home-aboutUs" className="animation-eva">
        <div className="innerHomeAboutUs">
          <div className="padding-lr-0 col-12 col-sm-7">
            <div className="leftAboutUs site-animation">
              <div className="imageAboutUs">
                <Link  title="𝐔𝐑𝐁𝐀𝐍𝐈𝐓𝐘 | 𝐍𝐄𝐖 𝐂𝐎𝐋𝐋𝐄𝐂𝐓𝐈𝐎𝐍">
                  <img
                    src="https://file.hstatic.net/200000000133/file/1000x600-min_0f26080a01954a0b9483c997aea6d7cf.jpg"
                    alt="𝐔𝐑𝐁𝐀𝐍𝐈𝐓𝐘 | 𝐍𝐄𝐖 𝐂𝐎𝐋𝐋𝐄𝐂𝐓𝐈𝐎𝐍"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="padding-lr-0 col-12 col-sm-5">
            <div className="rightAboutUs site-animation">
              <div className="sectionTitleAboutus">
                <h2>
                  <Link to="https://evadeeva.com.vn/collections/hang-moi-ve" title="𝐔𝐑𝐁𝐀𝐍𝐈𝐓𝐘 | 𝐍𝐄𝐖 𝐂𝐎𝐋𝐋𝐄𝐂𝐓𝐈𝐎𝐍">
                    𝐔𝐑𝐁𝐀𝐍𝐈𝐓𝐘 | 𝐍𝐄𝐖 𝐂𝐎𝐋𝐋𝐄𝐂𝐓𝐈𝐎𝐍
                  </Link>
                </h2>
              </div>
              <div className="sectionContentAboutus">
                <p style={{ textAlign: 'justify' }}>
                  𝐔𝐑𝐁𝐀𝐍𝐈𝐓𝐘 | 𝐍𝐄𝐖 𝐂𝐎𝐋𝐋𝐄𝐂𝐓𝐈𝐎𝐍 Nguồn cảm hứng dẫn lối các nhà thiết kế của CRKing7 để sáng tạo nên BST
                  URBANITY chính là vẻ đẹp hiện đại nhưng đầy tinh tế của những cô gái thành thị. Kết hợp những yếu tố
                  hiện đại pha trộn nét nữ tính mang lại cái chạm mềm mại và lãng mạn cho từng trang phục, cho dù đó là
                  nhờ những tone màu bay bổng, các hoạ tiết sáng tạo hay phụ kiện ăn ý, tạo ra phong cách của những cô
                  gái đô thị vừa sành điệu, thu hút nhưng vẫn đầy sự tinh tế với tính nữ được toát ra mạnh mẽ.{' '}
                </p>
                <div className="btnCenter">
                  <Link
                    className="button btnlight btn-see-more"
                    to="/collections/hang-moi-ve"
                    title="Xem sản phẩm New Collection"
                  >
                    Xem sản phẩm New Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* sản phẩm collection */}
      <div className="section-home-collection collection-1-tabs collection-tabs">
        <div className="container">
          <div className="section-title">
            <div className="title-tabs__navigation">
              <ul className="nav tabs-navigation" data-limit-desktop={10} data-limit-mobile={6} data-index={2}>
                {!!category &&
                  !!category.length &&
                  category.map((item, index) => (
                    <li className="nav-item tab-header" key={index}>
                      <a
                        className={`tab-title nav-link ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(item.id)}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="tab-content section-content">
            <div className="list-product-row row">
              {!!productColection &&
                !!productColection.length &&
                productColection.map((item, i) => {
                  if (i > 10) {
                    return;
                  }
                  return (
                    <React.Fragment key={`product-${item.id}`}>
                      <ItemProduct
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        salePrice={item.salePrice}
                        img1={item.images[0].url}
                        img2={item.images[1].url}
                        sale={`${salesColection[item.sale]}`}
                        slide={false}
                      />
                    </React.Fragment>
                  );
                })}
            </div>
            <div
              className="see-more-product d-flex cursor-pointer"
              onClick={() =>
                navigate(path.product, { state: { categoryId: category.find((item) => item.id === activeTab)?.id } })
              }
            >
              <a className="button btnlight btn-see-more">
                Xem tất cả{' '}
                <strong className="coll-title">{category.find((item) => item.id === activeTab)?.title}</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* bài viết */}
      <div className="section-home-blogs">
        <div className="container">
          <div className="section-title d-flex justify-content-between">
            <h2 className="text-start">
              <Link to={path.article}>Bài viết mới nhất</Link>
            </h2>
            <div className="swiper-nav">
              <span
                className={`swiper-button swiper-category-prev ${
                  activeSlideArticle === 0 ? 'swiper-button-disabled' : ''
                }`}
                role="button"
                tabIndex={-1}
                onClick={handlePrevClickArticle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 511.993 511.993">
                  <g>
                    <g>
                      <g>
                        <path d="M487.292,235.408H20.59c-11.372,0-20.59,9.224-20.59,20.59c0,11.366,9.217,20.59,20.59,20.59h466.702 c11.372,0,20.59-9.217,20.59-20.59C507.882,244.625,498.665,235.408,487.292,235.408z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M505.96,241.434L304.187,39.653c-8.044-8.037-21.07-8.037-29.114,0c-8.044,8.044-8.044,21.084,0,29.121l187.216,187.223 L275.073,443.221c-8.044,8.037-8.044,21.077,0,29.114c4.022,4.022,9.286,6.033,14.557,6.033s10.535-2.011,14.557-6.033	l201.773-201.78C514.004,262.511,514.004,249.47,505.96,241.434z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span
                className={`swiper-button swiper-category-next ${
                  activeSlideArticle >= totalSlidesArticle - 4 ? 'swiper-button-disabled' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={handleNextClickArticle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 511.993 511.993">
                  <g>
                    <g>
                      <g>
                        <path d="M487.292,235.408H20.59c-11.372,0-20.59,9.224-20.59,20.59c0,11.366,9.217,20.59,20.59,20.59h466.702 c11.372,0,20.59-9.217,20.59-20.59C507.882,244.625,498.665,235.408,487.292,235.408z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M505.96,241.434L304.187,39.653c-8.044-8.037-21.07-8.037-29.114,0c-8.044,8.044-8.044,21.084,0,29.121l187.216,187.223 L275.073,443.221c-8.044,8.037-8.044,21.077,0,29.114c4.022,4.022,9.286,6.033,14.557,6.033s10.535-2.011,14.557-6.033	l201.773-201.78C514.004,262.511,514.004,249.47,505.96,241.434z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
            </div>
          </div>
          <div className="wrapper-content">
            <Swiper
              onSwiper={setSwiperRefArticle}
              slidesPerView={4}
              breakpoints={{
                0: {
                  slidesPerView: 1.4,
                  spaceBetween: 30,
                },
                760: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                990: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              spaceBetween={30}
              modules={[Navigation]}
              className="list-article-row"
            >
              {!!article &&
                !!article.length &&
                article.map((item, i) => (
                  <SwiperSlide key={i} className="article-item">
                    <div className="article-item__block">
                      <div className="article-item__image">
                        <div className="art-image">
                          <a
                            className="cursor-pointer"
                            onClick={() => navigate(path.detailArticle, { state: item.id })}
                          >
                            <img className=" lazyloaded" src={`${API_URL_IMAGE}${item.image}`} />
                          </a>
                        </div>
                      </div>
                      <div className="article-item__detail">
                        <h3 className="art-title" onClick={() => navigate(path.detailArticle, { state: item.id })}>
                          <a className="cursor-pointer">{item.title}</a>
                        </h3>
                        <div className="art-desc">
                          <p dangerouslySetInnerHTML={{ __html: item?.shortContent }}></p>
                        </div>
                        <div className="art-meta">
                          <div className="art-date">
                            <time>{formatDateString(item.modifiedDate)}</time>
                          </div>
                          <a
                            className="art-seemore cursor-pointer"
                            title={item.title}
                            onClick={() => navigate(path.detailArticle, { state: item.id })}
                          >
                            Xem thêm &gt;
                            <i className="fa fa-angle-double-right" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
      {/* gần cuối */}
      <div className="section-home-policy">
        <div className="container">
          <div className="list-policy-row row">
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
              <div className="policy-item__inner">
                <div className="policy-item__icon">
                  <div className="icon">
                    <img
                      className=" lazyloaded"
                      data-src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_1.png?v=275"
                      src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_1.png?v=275"
                      alt="Miễn phí vận chuyển"
                    />
                  </div>
                </div>
                <div className="policy-item__info">
                  <h3 className="info-title">Miễn phí vận chuyển</h3>
                  <div className="infor-des">Miễn phí đơn hàng từ 500.000đ</div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
              <div className="policy-item__inner">
                <div className="policy-item__icon">
                  <div className="icon">
                    <img
                      className=" lazyloaded"
                      data-src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_2.png?v=275"
                      src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_2.png?v=275"
                      alt="Miễn phí cước đổi hàng"
                    />
                  </div>
                </div>
                <div className="policy-item__info">
                  <h3 className="info-title">Miễn phí cước đổi hàng</h3>
                  <div className="infor-des">Đổi trả hàng sau 7 ngày nếu không vừa ý</div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
              <div className="policy-item__inner">
                <div className="policy-item__icon">
                  <div className="icon">
                    <img
                      className=" lazyloaded"
                      data-src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_3.png?v=275"
                      src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_3.png?v=275"
                      alt="Tổng Đài Bán Hàng Miễn Phí"
                    />
                  </div>
                </div>
                <div className="policy-item__info">
                  <h3 className="info-title">Tổng Đài Bán Hàng Miễn Phí</h3>
                  <div className="infor-des">
                    Gọi <b>0966821574</b> để được tư vấn
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 col-md-6 col-12 policy-item">
              <div className="policy-item__inner">
                <div className="policy-item__icon">
                  <div className="icon">
                    <img
                      className=" lazyloaded"
                      data-src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_4.png?v=275"
                      src="//theme.hstatic.net/200000000133/1001115658/14/home_policy_icon_4.png?v=275"
                      alt="Thanh toán đa dạng"
                    />
                  </div>
                </div>
                <div className="policy-item__info">
                  <h3 className="info-title">Thanh toán đa dạng</h3>
                  <div className="infor-des">Phương thức thanh toán đa dạng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
