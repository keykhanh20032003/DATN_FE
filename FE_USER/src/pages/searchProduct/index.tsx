import React from 'react';
import { useLocation } from 'react-router-dom';
import productApi from '~/apis/product.apis';
import saleApi from '~/apis/sale.apis';
import LoadingPage from '~/components/loadingPage';
import ItemProduct from '~/components/product';
import { Product } from '~/types/product.type';
import { Sale } from '~/types/sale.type';

const SearchProduct = () => {
  const location = useLocation();
  // const [keywordState, setKeywordState] = React.useState(location.state);
  const keywordState = location.state;
  const [keyword, setKeyword] = React.useState('');
  const [product, setProduct] = React.useState<Product[]>([]);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const getProduct = async (keyword) => {
    try {
      setIsLoading(true);
      const params = {
        keyword: keyword,
        pageNo: currentPage,
      };
      const res = await productApi.searchProduct(params);
      if (res.data.status) {
        setIsLoading(false);
        setProduct(res.data.data.data);
        const totalPages = Math.ceil(res.data.data.total / res.data.data.perPage);
        setTotalPage(totalPages);
        setCurrentPage(res.data.data.currentPage);
      } else {
        setIsLoading(false);
        setProduct([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    if (keywordState !== '') {
      getProduct(keywordState);
    }
  }, [keywordState]);
  const paginationItems: any = [];
  for (let i = 1; i <= totalPage; i++) {
    paginationItems.push(
      <a
        key={`pagination-item-${i}`}
        aria-label={`pagination-item-${i}`}
        className={`pagination--items ${i === currentPage ? 'active-page' : ''}`}
        onClick={() => handlePageClick(i)}
      >
        {i}
      </a>,
    );
  }
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  React.useEffect(() => {
    if (keywordState !== null) {
      getProduct(keywordState);
    } else if (keyword !== null) {
      getProduct(keyword);
    }
  }, [currentPage]);
  const getSale = async (id: number) => {
    try {
      const res = await saleApi.getSale(id);
      if (res.data.status) {
        const sale = res.data.data;
        setSales((prevMapping) => ({
          ...prevMapping,
          [id]: sale.discount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    if (product.length > 0) {
      product.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0 && item.sale !== undefined) {
          await getSale(item.sale);
        }
      });
    }
  }, [product]);
  const hanleSearch = () => {
    if (keyword !== '') {
      getProduct(keyword);
      // setKeywordState('');
    }
  };
  return (
    <>
      {isLoading && <LoadingPage />}
      <div className="mainWrapper--content">
        <div className="layout-searchPage" id="layout-searchpage">
          <div className="container">
            <div className="heading-page">
              <h1>Tìm kiếm</h1>
              {product.length > 0 && (
                <p className="subtxt">
                  Có <strong>{product.length} sản phẩm</strong> cho tìm kiếm
                </p>
              )}
            </div>
            <div className="wrapbox-content-page">
              <div className="content-page">
                <div className="content-page" id="search">
                  {product.length > 0 && (
                    <>
                      <p className="subtext-result">
                        Kết quả tìm kiếm cho <strong>" {keyword === '' ? `${keywordState}` : `${keyword}`}"</strong>.{' '}
                      </p>
                      <div className="search-list-results">
                        <div className=" row listProduct-row listProduct-resize">
                          {/* Begin results */}
                          {!!product &&
                            !!product.length &&
                            product.map((item) => (
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
                      </div>{' '}
                      {/* End results */}
                      <div className="toolbar-pagi">
                        <div className="ajax-pagi">
                          <div className="d-flex align-items-center justify-content-center pagination">
                            {currentPage > 1 && (
                              <a
                                className="prev-page pagination--items"
                                aria-label="pagination-prev"
                                onClick={() => handlePageClick(currentPage - 1)}
                              />
                            )}
                            {totalPage > 1 && { paginationItems }}
                            {currentPage < totalPage && (
                              <a
                                className="next-page pagination--items"
                                aria-label="pagination-next"
                                onClick={() => handlePageClick(currentPage + 1)}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {product.length === 0 && (
                    <div className="expanded-message text-center">
                      <h2>Không tìm thấy nội dung bạn yêu cầu</h2>
                      <div className="subtext">
                        <span>
                          Không tìm thấy <strong>"{keyword === '' ? `${keywordState}` : `${keyword}`}"</strong>.{' '}
                        </span>
                        <span>Vui lòng kiểm tra chính tả, sử dụng các từ tổng quát hơn và thử lại!</span>
                      </div>
                      <div className="search-field">
                        <div className="search-page">
                          <input type="submit" id="go" onClick={hanleSearch} />
                          <input
                            type="text"
                            className="search_box"
                            placeholder="Tìm kiếm"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchProduct;
