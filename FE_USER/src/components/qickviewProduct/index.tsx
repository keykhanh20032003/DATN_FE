import React from 'react';

const QuickviewProduct = () => {
  return (
    <div id="modal-quickview" className="noscroll-bar modal fade modal-quickview show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content wrapper-quickview">
          <div className="modal-header modal-paramlink">
            <div className="modal-close quickview-close" onClick={closeModal}></div>
            <div className="paramlink-topbar text-center">
              <h4 className="purl-title">
                <span>{product?.name}</span>
              </h4>
            </div>
          </div>
          <div className="modal-body modal-detailProduct">
            <div className="productDetail-information">
              <div className="productDetail--gallery product-gallery">
                <div className="product-gallery__inner sticky-gallery">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    centeredSlides={true}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation, Thumbs, FreeMode]}
                    className="product-gallery__slide"
                  >
                    {!!productImage &&
                      !!productImage.length &&
                      productImage.map((item, i) => {
                        return (
                          <SwiperSlide key={i} className="">
                            <div className="product-gallery__item boxlazy-img">
                              <div className="boxlazy-img__insert lazy-img__prod">
                                <span className="boxlazy-img__aspect">
                                  <img src={`${API_URL_IMAGE}${item.url}`} />
                                </span>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                  </Swiper>
                  <Swiper
                    onSwiper={handleThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    navigation={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="product-gallery__thumb"
                  >
                    {!!productImage &&
                      !!productImage.length &&
                      productImage.map((item, i) => {
                        return (
                          <SwiperSlide key={i} className="product-thumb">
                            <a className="product-thumb__link boxlazy-img">
                              <div className="boxlazy-img__insert lazy-img__prod">
                                <span className="boxlazy-img__aspect">
                                  <img className="product-thumb__photo" src={`${API_URL_IMAGE}${item.url}`} />
                                </span>
                              </div>
                            </a>
                          </SwiperSlide>
                        );
                      })}
                  </Swiper>
                </div>
              </div>
              <div className="productDetail--content product-info">
                {/* info */}
                <div className="info-header">
                  <div className="product-name">
                    <h2>{product?.name}</h2>
                  </div>
                  <div className="product-sku">
                    <span id="pro_sku">
                      Mã sản phẩm: <strong>{product?.sku}</strong>
                    </span>
                    <span className="pro-state">
                      Chất liệu:
                      <strong>{product?.material}</strong>
                    </span>
                    <span className="pro-vendor">
                      Thương hiệu:{' '}
                      <strong>
                        <Link to="">Fashion Hub</Link>
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="info-body">
                  <div className="product-price">
                    <span className="pro-title">Giá:</span>
                    <span className="pro-price">{formatPrice(product?.salePrice)}</span>
                    {isSale && (
                      <>
                        <del className="">{formatPrice(product?.price)}</del>
                        <span className="pro-percent">
                          <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 512.002 512.002">
                            <g>
                              <path
                                d="m201.498 512.002c-1.992 0-4.008-.398-5.934-1.229-6.741-2.907-10.387-10.266-8.617-17.39l50.724-204.178h-136.67c-4.947 0-9.576-2.439-12.373-6.52s-3.402-9.278-1.617-13.892l100.262-259.204c2.235-5.779 7.793-9.589 13.989-9.589h137.961c5.069 0 9.795 2.56 12.565 6.806 2.768 4.246 3.206 9.603 1.162 14.242l-59.369 134.76h117.42c5.486 0 10.534 2.995 13.164 7.81 2.63 4.814 2.422 10.68-.543 15.296l-209.496 326.192c-2.833 4.412-7.651 6.896-12.628 6.896z"
                                fill="#ffffff"
                                data-original="#000000"
                              />
                            </g>
                          </svg>
                          - {props.sale}%
                        </span>
                      </>
                    )}
                  </div>
                  {/* chọn size */}
                  <div className="product-variants">
                    <div>
                      <div className="select-swatch">
                        <div id="variant-swatch-0-qv" className="swatch clearfix">
                          <div className="pro-title">Màu sắc:</div>
                          <div className="select-swap">
                            {product?.colors.map((item, i) => (
                              <div className="n-sd swatch-element" key={i} onClick={() => handleColorChoose(i)}>
                                <input
                                  className={`variant-${i}`}
                                  id={`swatch-${i}-${item.value}-qv`}
                                  type="radio"
                                  readOnly
                                />
                                <label
                                  className={`${selectedColorI === i ? 'sd' : ''}`}
                                  htmlFor={`swatch-${i}-${item.value}-qv`}
                                >
                                  <span>{item.value}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div id="variant-swatch-1-qv" className="swatch clearfix">
                          <div className="pro-title">Kích thước: </div>
                          <div className="select-swap">
                            {allSizes.map((size, i) => (
                              <div
                                className={`n-sd swatch-element ${size.total === 0 ? 'soldout' : ''}`}
                                key={i}
                                onClick={() => handleSizeChoose(i)}
                              >
                                <input
                                  className={`variant-${i}`}
                                  id={`swatch-${i}-${size.value}-qv`}
                                  type="radio"
                                  readOnly
                                />
                                <label
                                  htmlFor={`swatch-${i}-${size.value}-qv`}
                                  className={`${selectedSizeI === i ? 'sd' : ''}`}
                                >
                                  <span>{size.value}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* số lượng */}
                  <div className="product-quantity">
                    <div className="pro-title">Số lượng: </div>
                    <div className="pro-qty d-flex align-items-center">
                      <button className="qty-btn" onClick={handleMinusClick}>
                        <svg focusable="false" className="icon icon--minus " viewBox="0 0 10 2" role="presentation">
                          <path d="M10 0v2H0V0z" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        id="quickview-qtyvalue"
                        name="quantity"
                        value={quantity}
                        min={1}
                        className="qty-value"
                        readOnly
                      />
                      <button className="qty-btn" onClick={handlePlusClick}>
                        <svg focusable="false" className="icon icon--plus " viewBox="0 0 10 10" role="presentation">
                          <path d="M6 4h4v2H6v4H4V6H0V4h4V0h2v4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* thêm vào giỏ */}
                  <div className="product-actions">
                    <div className="product-actions__inner">
                      <div className="action-buys">
                        <button
                          type="submit"
                          name="add-to-cart"
                          className="button btnred btn-addtocart-qv "
                          id="add-to-cart-qv"
                          onClick={addToCart}
                        >
                          <span className="add-to-cart--text">Thêm vào giỏ </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="product-share">
                    <span className="pro-title">Chia sẻ: </span>
                    <a
                      href="//www.facebook.com/sharer/sharer.php?u=https://torano.vn/products/ao-polo-can-phoi-vai-2-estp022"
                      target="_blank"
                      className="tooltip-cs share-facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 512 512">
                        <g>
                          <g>
                            <path
                              d="m512 256c0 127.78-93.62 233.69-216 252.89v-178.89h59.65l11.35-74h-71v-48.02c0-20.25 9.92-39.98 41.72-39.98h32.28v-63s-29.3-5-57.31-5c-58.47 0-96.69 35.44-96.69 99.6v56.4h-65v74h65v178.89c-122.38-19.2-216-125.11-216-252.89 0-141.38 114.62-256 256-256s256 114.62 256 256z"
                              fill="#1877f2"
                              data-original="#1877f2"
                            />
                            <path
                              d="m355.65 330 11.35-74h-71v-48.021c0-20.245 9.918-39.979 41.719-39.979h32.281v-63s-29.296-5-57.305-5c-58.476 0-96.695 35.44-96.695 99.6v56.4h-65v74h65v178.889c13.034 2.045 26.392 3.111 40 3.111s26.966-1.066 40-3.111v-178.889z"
                              fill="#ffffff"
                              data-original="#ffffff"
                            />
                          </g>
                        </g>
                      </svg>
                      <span className="tooltip-hover">Facebook</span>
                    </a>
                    <a
                      href="https://m.me/607326116068401"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="messenger"
                      className="tooltip-cs share-messenger"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 28 28">
                        <g fill="none" fillRule="evenodd">
                          <g>
                            <g>
                              <g>
                                <g>
                                  <g>
                                    <g transform="translate(-293.000000, -708.000000) translate(180.000000, 144.000000) translate(16.000000, 16.000000) translate(0.000000, 548.000000) translate(61.000000, 0.000000) translate(36.000000, 0.000000)">
                                      <circle cx={14} cy={14} r={14} fill="#0084FF" />
                                      <path
                                        fill="#FFF"
                                        d="M14.848 15.928l-1.771-1.9-3.457 1.9 3.802-4.061 1.815 1.9 3.414-1.9-3.803 4.061zM14.157 7.2c-3.842 0-6.957 2.902-6.957 6.481 0 2.04 1.012 3.86 2.593 5.048V21.2l2.368-1.308c.632.176 1.302.271 1.996.271 3.842 0 6.957-2.902 6.957-6.482S17.999 7.2 14.157 7.2z"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span className="tooltip-hover">Messenger</span>
                    </a>
                    <a
                      href="https://twitter.com/intent/tweet?text=optional%20promo%20text%20https://torano.vn/products/ao-polo-can-phoi-vai-2-estp022"
                      target="_blank"
                      className="tooltip-cs share-twitter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 291.319 291.319">
                        <g>
                          <g>
                            <path
                              style={{}}
                              d="M145.659,0c80.45,0,145.66,65.219,145.66,145.66c0,80.45-65.21,145.659-145.66,145.659 S0,226.109,0,145.66C0,65.219,65.21,0,145.659,0z"
                              fill="#26a6d1"
                              data-original="#26a6d1"
                              className="hovered-path"
                            />
                            <path
                              style={{}}
                              d="M236.724,98.129c-6.363,2.749-13.21,4.597-20.392,5.435c7.338-4.27,12.964-11.016,15.613-19.072 c-6.864,3.96-14.457,6.828-22.55,8.366c-6.473-6.691-15.695-10.87-25.909-10.87c-19.591,0-35.486,15.413-35.486,34.439 c0,2.704,0.31,5.335,0.919,7.857c-29.496-1.438-55.66-15.158-73.157-35.996c-3.059,5.089-4.807,10.997-4.807,17.315 c0,11.944,6.263,22.504,15.786,28.668c-5.826-0.182-11.289-1.721-16.086-4.315v0.437c0,16.696,12.235,30.616,28.476,33.784 c-2.977,0.783-6.109,1.211-9.35,1.211c-2.285,0-4.506-0.209-6.673-0.619c4.515,13.692,17.625,23.651,33.165,23.925	c-12.153,9.249-27.457,14.748-44.089,14.748c-2.868,0-5.69-0.164-8.476-0.482c15.722,9.777,34.367,15.485,54.422,15.485 c65.292,0,100.997-52.51,100.997-98.029l-0.1-4.461C225.945,111.111,231.963,105.048,236.724,98.129z"
                              fill="#ffffff"
                              data-original="#ffffff"
                            />
                          </g>
                        </g>
                      </svg>
                      <span className="tooltip-hover">Twitter</span>
                    </a>
                    <a
                      href="//pinterest.com/pin/create/link/?url=https://torano.vn&media=https://product.hstatic.net/200000690725/product/52901478774_f103d7180e_o_6ec337721b6d4a8bae3c2626bca7d037.jpg&description=Áo polo can phối vai ESTP022"
                      target="_blank"
                      className="tooltip-cs share-pinterest"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 112.198 112.198">
                        <g>
                          <g>
                            <circle
                              style={{}}
                              cx="56.099"
                              cy="56.1"
                              r="56.098"
                              fill="#cb2027"
                              data-original="#cb2027"
                            />
                            <g>
                              <path
                                style={{}}
                                d="M60.627,75.122c-4.241-0.328-6.023-2.431-9.349-4.45c-1.828,9.591-4.062,18.785-10.679,23.588 c-2.045-14.496,2.998-25.384,5.34-36.941c-3.992-6.72,0.48-20.246,8.9-16.913c10.363,4.098-8.972,24.987,4.008,27.596 c13.551,2.724,19.083-23.513,10.679-32.047c-12.142-12.321-35.343-0.28-32.49,17.358c0.695,4.312,5.151,5.621,1.78,11.571 c-7.771-1.721-10.089-7.85-9.791-16.021c0.481-13.375,12.018-22.74,23.59-24.036c14.635-1.638,28.371,5.374,30.267,19.14 C85.015,59.504,76.275,76.33,60.627,75.122L60.627,75.122z"
                                fill="#f1f2f2"
                                data-original="#f1f2f2"
                                className=""
                              />
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span className="tooltip-hover">Pinterest</span>
                    </a>
                    <a
                      className="tooltip-cs share-link-js"
                      data-url="https://torano.vn/products/ao-polo-can-phoi-vai-2-estp022"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 496.158 496.158">
                        <g>
                          <path
                            style={{}}
                            d="M0,248.085C0,111.064,111.07,0.003,248.076,0.003c137.012,0,248.082,111.061,248.082,248.082 c0,137.002-111.07,248.07-248.082,248.07C111.07,496.155,0,385.087,0,248.085z"
                            fill="#25b7d3"
                            data-original="#25b7d3"
                            className=""
                          />
                          <g>
                            <path
                              style={{}}
                              d="M394.463,151.309l-49.615-49.614c-10.727-10.728-28.119-10.726-38.844,0l-76.631,76.63 c-10.726,10.728-10.727,28.119-0.001,38.847l49.615,49.614c10.727,10.727,28.119,10.726,38.845-0.002l76.631-76.63 C405.188,179.429,405.189,162.036,394.463,151.309z M312.59,235.423c-6.289,6.288-16.484,6.289-22.772,0.001l-29.084-29.084 c-6.288-6.288-6.287-16.483,0.001-22.772l50.511-50.511c6.287-6.287,16.482-6.288,22.771,0l29.084,29.085	c6.288,6.287,6.287,16.482,0,22.77L312.59,235.423z"
                              fill="#ffffff"
                              data-original="#ffffff"
                              className=""
                            />
                            <path
                              style={{}}
                              d="M266.786,278.986l-49.614-49.614c-10.727-10.727-28.119-10.726-38.845,0l-76.631,76.632 c-10.726,10.726-10.727,28.118,0,38.844l49.615,49.615c10.726,10.727,28.119,10.725,38.844,0l76.632-76.633 C277.511,307.105,277.513,289.713,266.786,278.986z M184.912,363.1c-6.288,6.288-16.482,6.29-22.771,0.001l-29.084-29.084 c-6.289-6.288-6.288-16.483,0-22.771l50.512-50.512c6.287-6.287,16.482-6.288,22.771,0l29.084,29.084 c6.288,6.289,6.287,16.484,0,22.771L184.912,363.1z"
                              fill="#ffffff"
                              data-original="#ffffff"
                              className=""
                            />
                          </g>
                          <path
                            style={{}}
                            d="M306.907,191.673l-2.42-2.421c-7.742-7.743-20.34-7.743-28.083,0l-87.151,87.151 c-7.742,7.742-7.742,20.34,0,28.082l2.42,2.421c7.742,7.741,20.34,7.741,28.083,0l87.151-87.152 C314.649,212.013,314.649,199.414,306.907,191.673z"
                            fill="#48a1af"
                            data-original="#48a1af"
                          />
                          <path
                            style={{}}
                            d="M215.398,302.548c-5.348,5.348-14.02,5.349-19.368,0.001l-2.421-2.421 c-5.348-5.348-5.348-14.02,0-19.367l87.152-87.152c5.348-5.349,14.019-5.348,19.368,0.002l2.42,2.42 c5.347,5.348,5.349,14.019,0,19.366L215.398,302.548z"
                            fill="#ffffff"
                            data-original="#ffffff"
                            className=""
                          />
                          <g />
                        </g>
                      </svg>
                      <span className="tooltip-hover">Sao chép url</span>
                    </a>
                  </div>
                  <div
                    className="product-viewdetail text-start"
                    onClick={() => navigate(path.detailProduct, { state: props.id })}
                  >
                    <a href="" className="productdetail-link">
                      Xem chi tiết sản phẩm
                    </a>
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} x={0} y={0} viewBox="0 0 24 24">
                      <g>
                        <g data-name={19}>
                          <path d="m12 19a1 1 0 0 1 -.71-1.71l5.3-5.29-5.3-5.29a1 1 0 0 1 1.41-1.41l6 6a1 1 0 0 1 0 1.41l-6 6a1 1 0 0 1 -.7.29z" />
                          <path d="m6 19a1 1 0 0 1 -.71-1.71l5.3-5.29-5.3-5.29a1 1 0 0 1 1.42-1.42l6 6a1 1 0 0 1 0 1.41l-6 6a1 1 0 0 1 -.71.3z" />
                        </g>
                      </g>
                    </svg>
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

export default QuickviewProduct;
