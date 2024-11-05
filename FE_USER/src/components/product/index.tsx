import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import './styles.css';
import productApi from '~/apis/product.apis';
import { Color, Product, ProductImages, Size } from '~/types/product.type';
import { toast } from 'react-toastify';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import { User } from '~/types/user.type';
import { RootState } from '~/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import path from '~/constants/path';

interface IIProduct {
  id: number;
  price: number;
  salePrice: number;
  name: string;
  img1: string;
  img2: string;
  sale: string;
  slide: boolean;
}

const ItemProduct = (props: IIProduct) => {
  const navigate = useNavigate();
  const [isSale, setIsSale] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [product, setProduct] = React.useState<Product>();
  const [colors, setColors] = React.useState<Color[]>([]);
  const [sizes, setSizes] = React.useState<Size[]>([]);
  const [selectedColor, setSelectedColor] = React.useState('');
  const [selectedSizeI, setSelectedSizeI] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [productImage, setProductImage] = React.useState<ProductImages[]>([]);
  React.useEffect(() => {
    // Lọc các kích thước dựa trên màu sắc được chọn
    if (selectedColor) {
      const sizesForSelectedColor = colors.find((item) => item.value === selectedColor)?.sizes || [];
      const filteredSizes = sizesForSelectedColor.filter((size) => size.total > 0 || size.total === 0);
      setSizes(filteredSizes);
    } else {
      // Nếu không có màu sắc nào được chọn, hiển thị tất cả các kích thước có tổng lớn hơn 0
      const sizes = colors.flatMap((color) => color.sizes);
      const filteredSizes = sizes.filter((size) => size.total > 0);
      setSizes(filteredSizes);
    }
  }, [selectedColor, colors]);

  React.useEffect(() => {
    if (sizes.length > 0 && isOpen) {
      if (sizes[0]?.total === 0) {
        const nextAvailableSizeIndex = sizes.findIndex((size, index) => index !== 0 && size.total > 0);
        if (nextAvailableSizeIndex !== -1) {
          setSelectedSizeI(nextAvailableSizeIndex);
          setSelectedSize(sizes[nextAvailableSizeIndex]?.value);
        }
      } else {
        setSelectedSize(sizes[0]?.value || '');
      }
    }
  }, [sizes, isOpen]);
  React.useEffect(() => {
    if (props.salePrice === props.price) {
      setIsSale(false);
    }
  }, []);

  const getColor = async () => {
    try {
      const res = await productApi.getColor(product?.id);
      if (res.data.status) {
        const colors = res.data.data;
        setColors(colors);
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
    if (!!product && product !== null) {
      getColor();
      setSelectedColor(product.colors[0].value);
    }
  }, [product]);
  return (
    <>
      <div className={`product-loop ${props.slide ? 'product-loop-slide' : 'col-lg-cus5 col-lg-3 col-md-6 col-6'}`}>
        <div className="product-inner cursor-pointer">
          <div className="proloop-image">
            <div className="proloop-image__inner" onClick={() => navigate(path.detailProduct, { state: props.id })}>
              <div className="lazy-img lazy-img__prod first-image">
                <img className="img-loop lazyloaded img-zoom" src={`${API_URL_IMAGE}${props.img1}`} />
              </div>
              <div className="lazy-img lazy-img__prod second-image hovered-img d-none d-lg-block">
                <img className="img-loop lazyloaded img-zoom" src={`${API_URL_IMAGE}${props.img2}`} />
              </div>
            </div>
            <div className="proloop-image__position">
              {isSale && (
                <div className="pro-sale">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 512.002 512.002">
                      <g>
                        <path
                          d="m201.498 512.002c-1.992 0-4.008-.398-5.934-1.229-6.741-2.907-10.387-10.266-8.617-17.39l50.724-204.178h-136.67c-4.947 0-9.576-2.439-12.373-6.52s-3.402-9.278-1.617-13.892l100.262-259.204c2.235-5.779 7.793-9.589 13.989-9.589h137.961c5.069 0 9.795 2.56 12.565 6.806 2.768 4.246 3.206 9.603 1.162 14.242l-59.369 134.76h117.42c5.486 0 10.534 2.995 13.164 7.81 2.63 4.814 2.422 10.68-.543 15.296l-209.496 326.192c-2.833 4.412-7.651 6.896-12.628 6.896z"
                          fill="#ffffff"
                          data-original="#000000"
                        />
                      </g>
                    </svg>
                    -{props.sale} %
                  </span>
                </div>
              )}
              {/* {props.quantity === 0 && (
              <div className="pro-soldout">
                <span>Hết hàng</span>
              </div>
            )} */}
            </div>
            <div className="proloop-actions">
              <div className="proloop-actions__inner">
                <div className="proloop-actions__cart">
                  <div className="actions-primary">
                    <button
                      className={`button btn-small btn-proloop-cart add-to-cart btn-addcart-view`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 22 22">
                        <path d="M15.95 6H19.7V17.875C19.7 18.7344 19.3875 19.4635 18.7625 20.0625C18.1635 20.6875 17.4344 21 16.575 21H5.325C4.46563 21 3.72344 20.6875 3.09844 20.0625C2.49948 19.4635 2.2 18.7344 2.2 17.875V6H5.95C5.95 4.61979 6.43177 3.44792 7.39531 2.48438C8.3849 1.49479 9.56979 1 10.95 1C12.3302 1 13.5021 1.49479 14.4656 2.48438C15.4552 3.44792 15.95 4.61979 15.95 6ZM13.1375 3.8125C12.5385 3.1875 11.8094 2.875 10.95 2.875C10.0906 2.875 9.34844 3.1875 8.72344 3.8125C8.12448 4.41146 7.825 5.14062 7.825 6H14.075C14.075 5.14062 13.7625 4.41146 13.1375 3.8125ZM17.825 17.875V7.875H15.95V9.4375C15.95 9.69792 15.8589 9.91927 15.6766 10.1016C15.4943 10.2839 15.2729 10.375 15.0125 10.375C14.7521 10.375 14.5307 10.2839 14.3484 10.1016C14.1661 9.91927 14.075 9.69792 14.075 9.4375V7.875H7.825V9.4375C7.825 9.69792 7.73385 9.91927 7.55156 10.1016C7.36927 10.2839 7.14792 10.375 6.8875 10.375C6.62708 10.375 6.40573 10.2839 6.22344 10.1016C6.04115 9.91927 5.95 9.69792 5.95 9.4375V7.875H4.075V17.875C4.075 18.2135 4.19219 18.5 4.42656 18.7344C4.68698 18.9948 4.98646 19.125 5.325 19.125H16.575C16.9135 19.125 17.2 18.9948 17.4344 18.7344C17.6948 18.5 17.825 18.2135 17.825 17.875Z" />
                      </svg>
                      <span className="btnadd">
                        {/* {props.quantity === 0 ? ' Thêm vào giỏ ' : ' Hết hàng '} */}
                        Thêm vào giỏ
                      </span>
                    </button>
                  </div>
                </div>
                <div className="proloop-actions__quickview">
                  <button className="icon-quickview tooltip-cs " title="Xem nhanh" >
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 577.029 577.029">
                      <g>
                        <g>
                          <path
                            d="M288.514,148.629c73.746,0,136.162,33.616,175.539,61.821c46.652,33.415,70.66,65.737,76.885,78.065
    						c-6.232,12.327-30.232,44.649-76.885,78.065c-39.377,28.204-101.793,61.82-175.539,61.82c-73.746,0-136.161-33.616-175.539-61.82
    						c-46.661-33.416-70.66-65.738-76.894-78.065c6.234-12.328,30.233-44.65,76.885-78.065
    						C152.353,182.245,214.768,148.629,288.514,148.629 M288.514,113.657C129.176,113.657,0,253.543,0,288.515
    						s129.176,174.857,288.514,174.857c159.339,0,288.515-139.886,288.515-174.857S447.854,113.657,288.514,113.657L288.514,113.657z
    						M288.514,183.601c-57.939,0-104.914,46.975-104.914,104.914c0,57.938,46.975,104.914,104.914,104.914
    						s104.914-46.976,104.914-104.914C393.428,230.576,346.453,183.601,288.514,183.601z M260.266,288.515
    						c-24.515,0-44.388-19.873-44.388-44.388c0-24.515,19.873-44.387,44.388-44.387c24.515,0,44.388,19.873,44.388,44.387
    						C304.654,268.642,284.781,288.515,260.266,288.515z"
                          />
                        </g>
                      </g>
                    </svg>
                    <span className="tooltip-hover">Xem nhanh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="proloop-detail">
            <h3 className="proloop-title">
              <a className="cursor-pointer" onClick={() => navigate(path.detailProduct, { state: props.id })}>
                {props.name}
              </a>
            </h3>
            <p className="proloop-price on-sale">
              <span className="price">
                {isSale ? `${formatPrice(props.salePrice)}` : `${formatPrice(props.price)}`}
              </span>
              {isSale && <span className="price-del">{formatPrice(props.price)}</span>}
              <span className="addtocart-mb d-sm-block d-lg-none">
                <a className="icon-addtocart">
                  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 22 22">
                    <path d="M15.95 6H19.7V17.875C19.7 18.7344 19.3875 19.4635 18.7625 20.0625C18.1635 20.6875 17.4344 21 16.575 21H5.325C4.46563 21 3.72344 20.6875 3.09844 20.0625C2.49948 19.4635 2.2 18.7344 2.2 17.875V6H5.95C5.95 4.61979 6.43177 3.44792 7.39531 2.48438C8.3849 1.49479 9.56979 1 10.95 1C12.3302 1 13.5021 1.49479 14.4656 2.48438C15.4552 3.44792 15.95 4.61979 15.95 6ZM13.1375 3.8125C12.5385 3.1875 11.8094 2.875 10.95 2.875C10.0906 2.875 9.34844 3.1875 8.72344 3.8125C8.12448 4.41146 7.825 5.14062 7.825 6H14.075C14.075 5.14062 13.7625 4.41146 13.1375 3.8125ZM17.825 17.875V7.875H15.95V9.4375C15.95 9.69792 15.8589 9.91927 15.6766 10.1016C15.4943 10.2839 15.2729 10.375 15.0125 10.375C14.7521 10.375 14.5307 10.2839 14.3484 10.1016C14.1661 9.91927 14.075 9.69792 14.075 9.4375V7.875H7.825V9.4375C7.825 9.69792 7.73385 9.91927 7.55156 10.1016C7.36927 10.2839 7.14792 10.375 6.8875 10.375C6.62708 10.375 6.40573 10.2839 6.22344 10.1016C6.04115 9.91927 5.95 9.69792 5.95 9.4375V7.875H4.075V17.875C4.075 18.2135 4.19219 18.5 4.42656 18.7344C4.68698 18.9948 4.98646 19.125 5.325 19.125H16.575C16.9135 19.125 17.2 18.9948 17.4344 18.7344C17.6948 18.5 17.825 18.2135 17.825 17.875Z" />
                  </svg>
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemProduct;
