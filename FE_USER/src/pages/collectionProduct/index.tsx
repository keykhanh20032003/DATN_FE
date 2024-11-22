import React from 'react';
import { useLocation } from 'react-router-dom';
import productApi from '~/apis/product.apis';
import saleApi from '~/apis/sale.apis';
import Breadcrum from '~/components/breadcrumb';
import { Product } from '~/types/product.type';
import { toast } from 'react-toastify';
import { Sale } from '~/types/sale.type';

const CollectionProduct = () => {
  const location = useLocation();
  const idCategory = location.state;
  const [listProduct, setListProduct] = React.useState<Product[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const getProduct = async () => {
    try {
      const res = await productApi.getProductByCategory(idCategory);
      if (res.data.status) {
        setListProduct(res.data.data.data);
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
    getProduct();
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
  React.useEffect(() => {
    if (listProduct.length > 0) {
      listProduct.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0) {
          await getSale(item.sale);
        }
      });
    }
  }, [listProduct]);
  return (
    <div className="layout-collections">
      <Breadcrum title={'Sản phẩm'} />
      <div className="container">
        <div className="section-collection">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-12 sidebar sidebar-left">
              <div className="filter-wrapper sticky-sidebar">
                {/* <div className="filter-current is-show">
                  <div className="widget-title">
                    <div className="filter-subtitle">Bạn đang xem </div>
                  </div>
                  <div className="list-tags">
                    <div className="filter_tags" />
                    <div className="filter_tags price opened">
                      Khoảng giá: <b id="priceNoUiSlide">0đ - 2,030,303đ</b>
                      <span className="filter_tags_remove">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 50 50"
                          xmlSpace="preserve"
                        >
                          <path
                            fill="#333"
                            d="M9.016 40.837a1.001 1.001 0 0 0 1.415-.001l14.292-14.309 14.292 14.309a1 1 0 1 0 1.416-1.413L26.153 25.129 40.43 10.836a1 1 0 1 0-1.415-1.413L24.722 23.732 10.43 9.423a1 1 0 1 0-1.415 1.413l14.276 14.293L9.015 39.423a1 1 0 0 0 .001 1.414z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="filter_tags">
                      Màu sắc: <b />
                      <span className="filter_tags_remove">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 50 50"
                          xmlSpace="preserve"
                        >
                          <path
                            fill="#333"
                            d="M9.016 40.837a1.001 1.001 0 0 0 1.415-.001l14.292-14.309 14.292 14.309a1 1 0 1 0 1.416-1.413L26.153 25.129 40.43 10.836a1 1 0 1 0-1.415-1.413L24.722 23.732 10.43 9.423a1 1 0 1 0-1.415 1.413l14.276 14.293L9.015 39.423a1 1 0 0 0 .001 1.414z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="filter_tags opened">
                      Size: <b>M</b>
                      <span className="filter_tags_remove">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 50 50"
                          xmlSpace="preserve"
                        >
                          <path
                            fill="#333"
                            d="M9.016 40.837a1.001 1.001 0 0 0 1.415-.001l14.292-14.309 14.292 14.309a1 1 0 1 0 1.416-1.413L26.153 25.129 40.43 10.836a1 1 0 1 0-1.415-1.413L24.722 23.732 10.43 9.423a1 1 0 1 0-1.415 1.413l14.276 14.293L9.015 39.423a1 1 0 0 0 .001 1.414z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="filter_tags filter_tags_remove_all opened">
                      <span>Xóa hết </span>
                    </div>
                  </div>
                </div> */}

                <div className="filter-content">
                  <div className="filter-inner">
                    <div className="filter-head">
                      <p>Bộ lọc</p>
                      <a className=" btn-filter-close d-sm-block d-lg-none">
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
                              <div id="range-price" className="noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr">
                                <div className="noUi-base">
                                  <div className="noUi-connects">
                                    <div
                                      className="noUi-connect"
                                      style={{ transform: 'translate(0%, 0px) scale(1, 1)' }}
                                    />
                                  </div>
                                  <div
                                    className="noUi-origin"
                                    style={{ transform: 'translate(-100%, 0px)', zIndex: 5 }}
                                  >
                                    <div
                                      className="noUi-handle noUi-handle-lower"
                                      data-handle={0}
                                      tabIndex={0}
                                      role="slider"
                                      aria-orientation="horizontal"
                                      aria-valuemin={0.0}
                                      aria-valuemax={3000000.0}
                                      aria-valuenow={0.0}
                                      aria-valuetext="0đ"
                                    >
                                      <div className="noUi-touch-area" />
                                      <div className="noUi-tooltip">0đ</div>
                                    </div>
                                  </div>
                                  <div className="noUi-origin" style={{ transform: 'translate(0%, 0px)', zIndex: 4 }}>
                                    <div
                                      className="noUi-handle noUi-handle-upper"
                                      data-handle={1}
                                      tabIndex={0}
                                      role="slider"
                                      aria-orientation="horizontal"
                                      aria-valuemin={0.0}
                                      aria-valuemax={3000000.0}
                                      aria-valuenow={3000000.0}
                                      aria-valuetext="3,000,000đ"
                                    >
                                      <div className="noUi-touch-area" />
                                      <div className="noUi-tooltip">3,000,000đ</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="noUi-pips noUi-pips-horizontal">
                                  <div
                                    className="noUi-marker noUi-marker-horizontal noUi-marker-large"
                                    style={{ left: '0%' }}
                                  />
                                  <div
                                    className="noUi-value noUi-value-horizontal noUi-value-large"
                                    data-value={0}
                                    style={{ left: '0%' }}
                                  >
                                    0đ
                                  </div>
                                  <div
                                    className="noUi-marker noUi-marker-horizontal noUi-marker-large"
                                    style={{ left: '100%' }}
                                  />
                                  <div
                                    className="noUi-value noUi-value-horizontal noUi-value-large"
                                    data-value={3000000}
                                    style={{ left: '100%' }}
                                  >
                                    3,000,000đ
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="filter-price__value">
                              <div id="smooth-steps-values">0đ - 3,000,000đ</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ./filter color */}
                      <div className="filter_group">
                        <div className="filter_group_block">
                          <div className="filter_group-subtitle">
                            <span>Màu sắc</span>
                          </div>
                          <div className="filter_group-content filter-color" style={{}}>
                            <ul className="checkbox-list clearfix"></ul>
                          </div>
                        </div>
                      </div>
                      {/* ./filter size */}
                      <div className="filter_group">
                        <div className="filter_group_block">
                          <div className="filter_group-subtitle">
                            <span>Size</span>
                          </div>
                          <div className="filter_group-content filter-size">
                            <ul className="checkbox-list">
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p1"
                                  defaultValue="S"
                                  name="size-filter"
                                  data-size="(variant:product=S)"
                                />
                                <label htmlFor="data-size-p1">S</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p2"
                                  defaultValue="M"
                                  name="size-filter"
                                  data-size="(variant:product=M)"
                                />
                                <label htmlFor="data-size-p2">M</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p3"
                                  defaultValue="L"
                                  name="size-filter"
                                  data-size="(variant:product=L)"
                                />
                                <label htmlFor="data-size-p3">L</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p4"
                                  defaultValue="XL"
                                  name="size-filter"
                                  data-size="(variant:product=XL)"
                                />
                                <label htmlFor="data-size-p4">XL</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p5"
                                  defaultValue="XXL"
                                  name="size-filter"
                                  data-size="(variant:product=XXL)"
                                />
                                <label htmlFor="data-size-p5">XXL</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p6"
                                  defaultValue={36}
                                  name="size-filter"
                                  data-size="(variant:product=36)"
                                />
                                <label htmlFor="data-size-p6">36</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p7"
                                  defaultValue={37}
                                  name="size-filter"
                                  data-size="(variant:product=37)"
                                />
                                <label htmlFor="data-size-p7">37</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p8"
                                  defaultValue={38}
                                  name="size-filter"
                                  data-size="(variant:product=38)"
                                />
                                <label htmlFor="data-size-p8">38</label>
                              </li>
                              <li>
                                <input
                                  type="checkbox"
                                  id="data-size-p9"
                                  defaultValue={39}
                                  name="size-filter"
                                  data-size="(variant:product=39)"
                                />
                                <label htmlFor="data-size-p9">39</label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="filter-footer">
                      <button id="clear-btn-filter" className="btn-filter btn-filter-clear">
                        Hủy
                      </button>
                      <button id="apply-btn-filter" className="btn-filter btn-filter-apply">
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
                  <h1 className="title">Sản phẩm</h1>
                  <div className="product-count">
                    <div className="count">
                      <b>{listProduct.length}</b> sản phẩm
                    </div>
                  </div>
                </div>
                <div className="product-filter-mb">
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
                    <span className="text">Cũ nhất</span>
                    <span className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 128 128">
                        <g>
                          <path d="m64 88c-1.023 0-2.047-.391-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0l37.172 37.172 37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40c-.781.781-1.805 1.172-2.828 1.172z" />
                        </g>
                      </svg>
                    </span>
                  </label>
                  <ul className="sort-by sort-by-content">
                    <li>
                      <span data-value="manual" data-filter="">
                        Sản phẩm nổi bật
                      </span>
                    </li>
                    <li>
                      <span data-value="price-ascending" data-filter="(price:product=asc)">
                        Giá: Tăng dần
                      </span>
                    </li>
                    <li>
                      <span data-value="price-descending" data-filter="(price:product=desc)">
                        Giá: Giảm dần
                      </span>
                    </li>
                    <li>
                      <span data-value="title-ascending" data-filter="(title:product=asc)">
                        Tên: A-Z
                      </span>
                    </li>
                    <li>
                      <span data-value="title-descending" data-filter="(title:product=desc)">
                        Tên: Z-A
                      </span>
                    </li>
                    <li>
                      <span data-value="created-ascending" data-filter="(updated_at:product=asc)">
                        Cũ nhất
                      </span>
                    </li>
                    <li>
                      <span data-value="created-descending" data-filter="(updated_at:product=desc)">
                        Mới nhất
                      </span>
                    </li>
                    <li>
                      <span data-value="best-selling" data-filter="(sold_quantity:product=desc)">
                        Bán chạy nhất
                      </span>
                    </li>
                    <li>
                      <span data-value="quantity-descending" data-filter="(quantity:product=desc)">
                        Tồn kho giảm dần
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="row list-product-row listProductFilter">
                {!!listProduct &&
                  !!listProduct.length &&
                  listProduct.map((item, i) => (
                    <React.Fragment key={i}>
                      <ItemProduct
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        salePrice={item.salePrice}
                        img1={item.images[0].url}
                        img2={item.images[1].url}
                        sale={`${sales[item.sale]}`}
                      />
                    </React.Fragment>
                  ))}
              </div>
              <div className="toolbar-pagi">
                <div className="ajax-pagi">
                  <div className="d-flex align-items-center justify-content-center pagination">
                    <a
                      data-link={1}
                      aria-label="pagination-item-1"
                      className="pagination--items active-page"
                      href="javascript:void(0)"
                    >
                      1
                    </a>
                    <a
                      data-link={2}
                      aria-label="pagination-item-2"
                      className="pagination--items"
                      href="/collections/onsale?sort_by=created-ascending&page=2"
                    >
                      2
                    </a>
                    <a
                      data-link={3}
                      aria-label="pagination-item-3"
                      className="pagination--items"
                      href="/collections/onsale?sort_by=created-ascending&page=3"
                    >
                      3
                    </a>
                    <a
                      data-link="p"
                      className="next-page pagination--items"
                      href="/collections/onsale?sort_by=created-ascending&page=2"
                      aria-label="pagination-next"
                    />
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

export default CollectionProduct;
