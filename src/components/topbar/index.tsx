import React from 'react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-bottom">
        <div className="container">
          <div className="box-content d-flex align-items-center justify-content-between">
            <div className="box-left d-flex flex-wrap align-items-center">
              <div className="hotline">
                <span>
                  Hotline CSKH: <Link to=""></Link> - Hotline mua hàng: <Link to=""></Link>
                </span>
              </div>
            </div>
            {/* <div className="box-right">
              <div className="notify">
                <div className="notify-title">
                  <span className="noti-tt">
                    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 32 32">
                      <g>
                        <g>
                          <path d="m29.39355 22.24194c0-1.85809-1.32587-3.40649-3.07745-3.76453v-7.15167c0-5.70001-4.62579-10.32574-10.3161-10.32574s-10.3161 4.62573-10.3161 10.32574v7.15167c-1.75159.35803-3.07745 1.90643-3.07745 3.76453 0 2.10968 1.7226 3.83221 3.84192 3.83221h19.10327c2.11932.00001 3.84191-1.72253 3.84191-3.83221z" />
                          <path d="m16 31c2.32263 0 4.32581-1.43231 5.15808-3.47424h-10.31616c.83227 2.04193 2.83545 3.47424 5.15808 3.47424z" />
                        </g>
                      </g>
                    </svg>
                    <span className="noti-numb d-none">2</span>
                    Thông báo của tôi
                  </span>
                </div>
                <div className="notify-container">
                  <div className="sitenav-wrapper sitenav-notify">
                    <div className="sitenav-inner">
                      <div className="sitenav-header">
                        <p className="sitenav-header__title">Thông báo</p>
                        <Link className="sitenav-header__btn btn-sitenav-close">
                          <svg viewBox="0 0 19 19" role="presentation">
                            <path
                              d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z"
                              fillRule="evenodd"
                            />
                          </svg>
                        </Link>
                      </div>
                      <div className="sitenav-content">
                        <div className="notify-content ajax-render-notify">
                          <div className="list-notify">
                            <article className="article-item ">
                              <div className="article-item__block">
                                <div className="article-item__detail">
                                  <h3 className="art-title">
                                    <Link to="/blogs/tin-tuc/wild-soul-bst-cham-den-ve-dep-cua-tam-hon-tu-do">
                                      WILD SOUL - BST CHẠM ĐẾN VẺ ĐẸP CỦA TÂM HỒN TỰ DO
                                    </Link>
                                  </h3>
                                  <div className="art-meta">
                                    <span className="art-date">
                                      <time dateTime="2023-08-02">02/08/2023</time>
                                    </span>
                                    <span className="art-link">
                                      <Link to="/blogs/tin-tuc/wild-soul-bst-cham-den-ve-dep-cua-tam-hon-tu-do">
                                        Xem chi tiết
                                      </Link>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </article>
                            <article className="article-item ">
                              <div className="article-item__block">
                                <div className="article-item__detail">
                                  <h3 className="art-title">
                                    <Link to="/blogs/tin-tuc/charme-retro-cam-hung-thanh-lich-dep-ben-vung-voi-thoi-gian">
                                      CHARME RETRO – CẢM HỨNG THANH LỊCH ĐẸP BỀN VỮNG VỚI THỜI GIAN
                                    </Link>
                                  </h3>
                                  <div className="art-meta">
                                    <span className="art-date">
                                      <time dateTime="2023-08-02">02/08/2023</time>
                                    </span>
                                    <span className="art-link">
                                      <Link to="/blogs/tin-tuc/charme-retro-cam-hung-thanh-lich-dep-ben-vung-voi-thoi-gian">
                                        Xem chi tiết
                                      </Link>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </article>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
