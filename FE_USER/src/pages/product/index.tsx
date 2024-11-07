import React from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import productApi from '~/apis/product.apis';
import saleApi from '~/apis/sale.apis';
import Breadcrum from '~/components/breadcrumb';
import ItemProduct from '~/components/product';
import { Product } from '~/types/product.type';
import { Sale } from '~/types/sale.type';
import noUiSlider from 'nouislider';
import { formatPrice } from '~/constants/utils';
import 'nouislider/dist/nouislider.css';
import Pagination from '~/components/paginationItems';
import LoadingPage from '~/components/loadingPage';
import SpinLoading from '~/components/spinloading';
import categoryApi from '~/apis/category.apis';
import { Category } from '~/types/category.type';

interface IIValue {
  value: string;
}
interface Params {
  valueSize: any[];
  valueColor: any[];
  minPrice: number;
  maxPrice: number;
  categoryId?: any | undefined;
  saleId?: any | undefined;
  pageNo: number;
  sortBy: string;
  sortDirection: string;
}
const ProductView = () => {
  const [listProduct, setListProduct] = React.useState<Product[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const location = useLocation();
  const state = location.state;
  const categoryId = state?.categoryId;
  const saleId = state?.saleId;
  const [sizes, setSizes] = React.useState<IIValue[]>([]);
  const [colors, setColors] = React.useState<IIValue[]>([]);
  const [valueSize, setValueSize] = React.useState<any[]>([]);
  const [valueColor, setValueColor] = React.useState<any[]>([]);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(3000000);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState('');
  const [sortDirection, setSortDirection] = React.useState('');
  const [totalPage, setTotalPage] = React.useState(1);
  const [selectedSortOption, setSelectedSortOption] = React.useState('Mới nhất');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowFlter, setIsShowFilter] = React.useState(true);
  const [category, setCategory] = React.useState<Category>();
  const [showFillColor, setShowFillColor] = React.useState(false);
  const [showFillSize, setShowFillSize] = React.useState(false);

  const getAllSize = async () => {
    try {
      const res = await productApi.getAllSize();

      if (res.data.status) {
        setSizes(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getAllColor = async () => {
    try {
      const res = await productApi.getAllColor();

      if (res.data.status) {
        setColors(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getAllColor();
    getAllSize();
  }, []);
  const getProduct = async () => {
    try {
      setIsLoading(true);
      const params: Params = {
        valueSize: valueSize,
        valueColor: valueColor,
        minPrice: minPrice,
        maxPrice: maxPrice,
        // categoryId: categoryId,
        pageNo: page,
        sortBy: sortBy,
        sortDirection: sortDirection,
      };
      if (!!categoryId) {
        params.categoryId = categoryId;
      }
      if (!!saleId) {
        params.saleId = saleId;
      }
      const res = await productApi.getAllProducts(params);
      if (res.data.status) {
        setListProduct(res.data.data.data);
        const totalPages = Math.ceil(res.data.data.total / res.data.data.perPage);
        setTotalPage(totalPages);
        setPage(res.data.data.currentPage);
      } else {
        setListProduct([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    getProduct();
  }, []);
  const getSale = async (id: number) => {
    try {
      const res = await saleApi.getSale(id);
      if (res.data.status) {
        const sale = res.data.data;
        setSales((prevMapping) => ({
          ...prevMapping,
          [id]: sale.discount,
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
    if (listProduct.length > 0) {
      listProduct.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0 && item.sale !== undefined) {
          await getSale(item.sale);
        }
      });
    }
  }, [listProduct]);
  const handleChooseSize = (selectedSize) => {
    // Kiểm tra xem selectedSize đã được chọn trước đó hay chưa
    if (valueSize.includes(selectedSize)) {
      // Nếu đã chọn rồi, loại bỏ khỏi mảng valueSize
      setValueSize(valueSize.filter((size) => size !== selectedSize));
    } else {
      // Nếu chưa chọn, thêm vào mảng valueSize
      setValueSize([...valueSize, selectedSize]);
    }
  };
  const handleChooseColor = (selectedColor) => {
    // Kiểm tra xem selectedColor đã được chọn trước đó hay chưa
    if (valueColor.includes(selectedColor)) {
      // Nếu đã chọn rồi, loại bỏ khỏi mảng valueColor
      setValueColor(valueColor.filter((color) => color !== selectedColor));
    } else {
      // Nếu chưa chọn, thêm vào mảng valueColor
      setValueColor([...valueColor, selectedColor]);
    }
  };
  const handlePageClick = (page) => {
    setPage(page);
  };
  const handleCacelFilter = () => {
    setValueColor([]);
    setValueSize([]);
    setMaxPrice(0);
    setMinPrice(3000000);
    setIsShowFilter(false);
  };
  React.useEffect(() => {
    const slider = document.getElementById('range-price') as any;

    noUiSlider.create(slider, {
      start: [minPrice, maxPrice],
      connect: true,
      range: {
        min: 0,
        max: 3000000,
      },
      tooltips: [
        {
          to(value) {
            return formatPrice(value);
          },
          from(value) {
            return formatPrice(value);
          },
        },
        {
          to(value) {
            return formatPrice(value);
          },
          from(value) {
            return formatPrice(value);
          },
        },
      ],
      pips: {
        mode: 'positions',
        values: [0, 100],
        format: {
          to(value) {
            return formatPrice(value);
          },
        },
        density: 100,
      },
    });

    slider.noUiSlider.on('update', (values, handle) => {
      if (handle === 0) {
        setMinPrice(parseInt(values[handle]));
      } else {
        setMaxPrice(parseInt(values[handle]));
      }
    });

    return () => {
      slider.noUiSlider.destroy();
    };
  }, [minPrice, maxPrice]);
  const handleSortChange = (sortByValue, sortDirectionValue, selectedOption) => {
    setSortBy(sortByValue);
    setSortDirection(sortDirectionValue);
    setSelectedSortOption(selectedOption);

    // Gọi hàm để tải sản phẩm với các giá trị sortBy và sortDirection mới
    getProduct();
  };
  React.useEffect(() => {
    getProduct();
  }, [valueSize, valueColor, minPrice, maxPrice, categoryId, page, sortBy, sortDirection, saleId]);
  const getCategory = async (id: number) => {
    if (!!categoryId) {
      try {
        const res = await categoryApi.getCategory(id);
        if (res.data.status) {
          setCategory(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    if (!!categoryId) {
      getCategory(categoryId);
    }
  }, [categoryId]);
  return (
    <>
      <div className="layout-collections">
        <Breadcrum title={categoryId ? category?.title : saleId ? 'Sản phẩm khuyến mãi' : 'Sản phẩm'} />
        <div className="container">
          <div className="section-collection">
            <div className="row">
              <div className="col-lg-3 col-md-12 col-12 sidebar sidebar-left">
                <div className="filter-wrapper sticky-sidebar">
                  <div
                    className={`filter-content ${isShowFlter ? 'show-filter' : ''}`}
                    style={isShowFlter ? { display: 'block' } : { display: 'none' }}
                  >
                    <div className="filter-inner">
                      <div className="filter-head">
                        <p>Bộ lọc</p>
                        <a className=" btn-filter-close d-sm-block d-lg-none" onClick={() => setIsShowFilter(false)}>
                          <svg viewBox="0 0 19 19" role="presentation">
                            <path
                              d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </a>
                      </div>
                      <div className="filter-options">
                        {/* ./filter price */}
                        <div className="filter_group">
                          <div className="filter_group_block">
                            <div className="filter_group-subtitle">
                              <span>Khoảng giá</span>
                            </div>
                            <div className="filter_group-content filter-price">
                              <div className="filter-price__range">
                                <div
                                  id="range-price"
                                  className="noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr"
                                ></div>
                              </div>
                              <div className="filter-price__value">
                                <div id="smooth-steps-values">
                                  {formatPrice(minPrice)} - {formatPrice(maxPrice)}đ
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* ./filter color */}
                        <div className="filter_group">
                          <div className="filter_group_block">
                            <div
                              className={`filter_group-subtitle ${showFillColor ? 'action-group' : ''}`}
                              onClick={() => setShowFillColor(!showFillColor)}
                            >
                              <span>Màu sắc</span>
                            </div>
                            <div
                              className="filter_group-content filter-size"
                              style={showFillColor ? { display: 'none' } : {}}
                            >
                              <ul className="checkbox-list clearfix">
                                {!!colors &&
                                  !!colors.length &&
                                  colors.map((item, i) => (
                                    <li key={i}>
                                      <input
                                        type="checkbox"
                                        id={`data-color-${i}`}
                                        name="color-filter"
                                        onChange={() => handleChooseColor(item.value)}
                                        checked={valueColor.includes(item.value)}
                                      />
                                      <label htmlFor={`data-color-${i}`}>{item?.value}</label>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* ./filter size */}
                        <div className="filter_group">
                          <div className="filter_group_block">
                            <div
                              className={`filter_group-subtitle ${showFillSize ? 'action-group' : ''}`}
                              onClick={() => setShowFillSize(!showFillSize)}
                            >
                              <span>Size</span>
                            </div>
                            <div
                              className="filter_group-content filter-size"
                              style={showFillSize ? { display: 'none' } : {}}
                            >
                              <ul className="checkbox-list">
                                {!!sizes &&
                                  !!sizes.length &&
                                  sizes.map((item, i) => (
                                    <li key={i}>
                                      <input
                                        type="checkbox"
                                        id={`data-size-${i}`}
                                        name="size-filter"
                                        onChange={() => handleChooseSize(item.value)}
                                        checked={valueSize.includes(item.value)}
                                      />
                                      <label htmlFor={`data-size-${i}`}>{item?.value}</label>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="filter-footer">
                        <button
                          id="clear-btn-filter"
                          className="btn-filter btn-filter-clear"
                          onClick={handleCacelFilter}
                        >
                          Hủy
                        </button>
                        <button
                          id="apply-btn-filter"
                          className="btn-filter btn-filter-apply"
                          onClick={() => setIsShowFilter(false)}
                        >
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 col-12 collection main-container">
                <div className="toolbar-products">
                  <div className="head-title">
                    <h1 className="title">
                      {categoryId ? category?.title : saleId ? 'Sản phẩm khuyến mãi' : 'Sản phẩm'}
                    </h1>
                    <div className="product-count">
                      <div className="count">
                        <b>{listProduct.length}</b> sản phẩm
                      </div>
                    </div>
                  </div>
                  <div className="product-filter-mb" onClick={() => setIsShowFilter(!isShowFlter)}>
                    <p>Bộ lọc</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 459 459">
                      <g>
                        <g>
                          <g>
                            <path d="M178.5,382.5h102v-51h-102V382.5z M0,76.5v51h459v-51H0z M76.5,255h306v-51h-306V255z" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="product-sort">
                    <label className="title">
                      Sắp xếp theo
                      <span className="text">{selectedSortOption}</span>
                    </label>
                    <ul className="sort-by sort-by-content">
                      <li>
                        <span
                          data-value="price-ascending"
                          onClick={() => handleSortChange('salePrice', 'asc', 'Giá: Tăng dần')}
                        >
                          Giá: Tăng dần
                        </span>
                      </li>
                      <li>
                        <span
                          data-value="price-descending"
                          onClick={() => handleSortChange('salePrice', 'desc', 'Giá: Giảm dần')}
                        >
                          Giá: Giảm dần
                        </span>
                      </li>
                      <li>
                        <span data-value="title-ascending" onClick={() => handleSortChange('name', 'asc', 'Tên: A-Z')}>
                          Tên: A-Z
                        </span>
                      </li>
                      <li>
                        <span
                          data-value="title-descending"
                          onClick={() => handleSortChange('name', 'desc', 'Tên: Z-A')}
                        >
                          Tên: Z-A
                        </span>
                      </li>
                      <li>
                        <span data-value="created-ascending" onClick={() => handleSortChange('id', 'asc', 'Cũ nhất')}>
                          Cũ nhất
                        </span>
                      </li>
                      <li>
                        <span
                          data-value="created-descending"
                          onClick={() => handleSortChange('id', 'desc', 'Mới nhất')}
                        >
                          Mới nhất
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="row list-product-row listProductFilter">
                  {!!listProduct &&
                    !!listProduct.length &&
                    listProduct.map((item, i) => (
                      <React.Fragment key={item.id}>
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
                {isLoading && <SpinLoading />}
                <Pagination page={page} totalPage={totalPage} handlePageClick={handlePageClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;
