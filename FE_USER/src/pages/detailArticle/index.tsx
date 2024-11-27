import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import articleApi from '~/apis/article.apis';
import Breadcrum from '~/components/breadcrumb';
import { formatDateNumber, formatDateString } from '~/constants/formatDate';
import { API_URL_IMAGE } from '~/constants/utils';
import { Article } from '~/types/article.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import { Navigation } from 'swiper/modules';
import path from '~/constants/path';

const DetailArticle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state;
  const [article, setArticle] = React.useState<Article>();
  const [articleRelated, setArticleRelated] = React.useState<Article[]>([]);
  const [articleNewest, setArticleNewest] = React.useState<Article[]>([]);
  const [showNewest, setShowNewest] = React.useState(true);

  const getArticle = async () => {
    try {
      const res = await articleApi.detailArticle(id);
      if (res.data.status) {
        setArticle(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getArticle();
  }, [id]);
  const getArticleRelated = async () => {
    try {
      if (!!article?.categoryId) {
        const res = await articleApi.relatedArticle(article?.categoryId);
        if (res.data.status) {
          setArticleRelated(res.data.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getArticleNewest = async () => {
    try {
      const res = await articleApi.getArticleHome();
      if (res.data.status) {
        setArticleNewest(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    if (!!article) {
      getArticleRelated();
    }
  }, [article]);
  React.useEffect(() => {
    getArticleNewest();
  }, []);
  return (
    <div className="layout-article" id="article">
      <Breadcrum title={'Bài viết'} />
      <div className="container">
        <div className="row">
          <div className="col-lg-9 col-md-12 col-12 column-left mg-page">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-12 wrapper-content">
                <div className="article-content">
                  <div className="heading">
                    <h1 className="title">{article?.title}</h1>
                    <div className="meta-post">
                      <span className="author">Người viết: {article?.author}</span>
                      <span className="date">
                        {article?.modifiedDate && <time>{formatDateString(article?.modifiedDate)}</time>}
                      </span>
                    </div>
                  </div>
                  <div className="wrapper-content">
                    <div className="article-image">
                      <img src={`${API_URL_IMAGE}${article?.image}`} />
                    </div>
                    <div
                      className="article-body article-table-contents typeList-style"
                      dangerouslySetInnerHTML={{ __html: article?.content }}
                    ></div>
                    <div className="article-nav">
                      <div className="row">
                        <div className="col-lg-8 col-md-12 col-12 articleToolbar-title">
                          <p>
                            Đang xem:
                            <span> {article?.title}</span>
                          </p>
                        </div>
                        <div className="col-lg-4 col-md-12 col-12 articleToolbar-navigation">
                          <div className="articleToolbar--nav">
                            {/* <span>
                                <a
                                  href="/blogs/news/cach-phoi-do-voi-quan-jogger-nu-don-gian-nhung-cuc-ky-ca-tinh"
                                  title=""
                                >
                                  Bài sau
                                </a>
                                <svg className="arrow-right" role="presentation" viewBox="0 0 11 18">
                                  <path
                                    d="M1.5 1.5l8 7.5-8 7.5"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    fill="none"
                                    fillRule="evenodd"
                                    strokeLinecap="square"
                                  />
                                </svg>
                              </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-12 wrapper-related">
                <div className="article-related">
                  <div className="heading">
                    <span className="title-related">Bài viết liên quan</span>
                  </div>
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    loop={true}
                    navigation={true}
                    modules={[Navigation]}
                    className="list-article-slide"
                  >
                    {!!articleRelated &&
                      !!articleRelated.length &&
                      articleRelated.map((item, i) => {
                        // Kiểm tra xem id của sản phẩm liên quan có giống với id của sản phẩm hiện tại không
                        if (item.id !== article?.id) {
                          return (
                            <SwiperSlide key={i} className="">
                              <div className="article-loop">
                                <div className="article-inner">
                                  <div className="article-image">
                                    <a className="blog-post-thumbnail cursor-pointer">
                                      <img className=" ls-is-cached lazyloaded" src={`${API_URL_IMAGE}${item.image}`} />
                                    </a>
                                  </div>
                                  <div className="article-detail">
                                    <div className="article-title">
                                      <h3 className="post-title cursor-pointer">
                                        <a>{item.title}</a>
                                      </h3>
                                    </div>
                                    <p className="entry-content">{item.shortContent}</p>
                                    <div className="article-post-meta">
                                      <span className="date">
                                        {item.modifiedDate && <time>{formatDateString(item.modifiedDate)}</time>}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          );
                        } else {
                          // Trả về null nếu id giống nhau để không hiển thị sản phẩm liên quan có cùng id
                          return null;
                        }
                      })}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-12 column-right mg-page">
            <aside className="sidebar-blogs blogs-sticky">
              {/* Bai viet moi nhat */}
              <div className={`group-sidebox ${showNewest ? 'is-open' : ''}`}>
                <div className="sidebox-title" onClick={() => setShowNewest(!showNewest)}>
                  <h3 className="htitle">Bài viết mới nhất</h3>
                </div>
                {showNewest && (
                  <div className="sidebox-content sidebox-content-togged">
                    <div className="list-blogs">
                      {!!articleNewest &&
                        !!articleNewest.length &&
                        articleNewest.map((item, i) => {
                          if (i > 4) return;
                          if (item.id !== article?.id) {
                            return (
                              <div
                                className="item-article"
                                key={i}
                                onClick={() => navigate(path.detailArticle, { state: item.id })}
                              >
                                <div className="item-article__image">
                                  <a className="cursor-pointer">
                                    <img className=" lazyloaded" src={`${API_URL_IMAGE}${item.image}`} />
                                  </a>
                                </div>
                                <div className="item-article__detail">
                                  <h3 className="title">
                                    <a className="link cursor-pointer">{item.title}</a>
                                  </h3>
                                  <p className="meta-post">
                                    <span className="cate">Ngày tạo - </span>
                                    {item?.modifiedDate && (
                                      <span className="date">{formatDateNumber(item.modifiedDate)}</span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
      {/* <div className="table-content-button">
          <button className="btn-icolist">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.994 511.994">
              <path d="M35.537 292.17l-.225-.863 14.613-15.857c9.495-10.333 16.006-18.227 19.544-23.47s5.3-11.326 5.3-18.148c0-10.135-3.326-18.146-9.974-23.984-6.65-5.83-15.9-8.76-27.775-8.76-11.174 0-20.15 3.467-26.923 10.412S.06 226.807.3 236.795l.15.34 24.473.002c0-4.403 1.076-8.9 3.227-12.097s5.105-4.73 8.863-4.73c4.202 0 7.355 1.26 9.457 3.73s3.152 5.8 3.152 9.955c0 2.917-1.04 6.36-3.115 10.313s-5.72 8.458-10.122 13.5L1.28 294.304v15.478h74.847v-17.6h-40.6zM51.9 127.068V37.72L1.28 45.283v17.945h24.215v63.84H1.28v19.812h74.846v-19.812zm21.156 299.964c-3.265-4.33-7.8-7.542-13.574-9.668 5.092-2.325 9.16-5.55 12.2-9.677s4.56-8.643 4.56-13.534c0-9.84-3.5-17.442-10.53-22.806s-16.4-8.046-28.1-8.046c-10.087 0-18.665 2.67-25.736 8S1.418 384.007 1.716 392.6l.15.83h24.327c0-4.403 1.233-5.774 3.707-7.654s5.34-3 8.603-3c4.154 0 7.317 1.065 9.495 3.4s3.262 5.142 3.262 8.555c0 4.3-1.2 7.868-3.632 10.3s-5.884 3.837-10.384 3.837h-11.75v17.6h11.75c4.995 0 8.863 1.475 11.608 3.872s4.117 6.358 4.117 11.597c0 3.76-1.312 6.943-3.93 9.415s-6.133 3.74-10.534 3.74c-3.857 0-7.13-1.662-9.827-4s-4.042-4.803-4.042-9.206H.16l-.147.95c-.247 10.087 3.423 18.042 11.013 23.357s16.453 8.1 26.588 8.1c11.77 0 21.435-2.765 29-8.427S77.96 452.44 77.96 442.55c0-6.033-1.63-11.195-4.894-15.523zm75.7-64.426h363.227v72.645H148.767zm0-143.09h363.227v72.645H148.767zm0-147.483h363.227v72.645H148.767z" />
            </svg>
          </button>{' '}
        </div>
        <div className="table-content-fixed">
          <div className="table-of-header">
            <span className="hTitle"> Các nội dung chính</span>
            <span className="hClose">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001">
                <path d="M284.286 256.002L506.143 34.144c7.81-7.81 7.81-20.475 0-28.285s-20.475-7.81-28.285 0L256 227.717 34.143 5.86c-7.81-7.81-20.475-7.81-28.285 0s-7.81 20.475 0 28.285L227.715 256 5.858 477.86c-7.81 7.81-7.81 20.475 0 28.285C9.763 510.05 14.882 512 20 512a19.94 19.94 0 0 0 14.143-5.857L256 284.287l221.857 221.857C481.762 510.05 486.88 512 492 512a19.94 19.94 0 0 0 14.143-5.857c7.81-7.81 7.81-20.475 0-28.285L284.286 256.002z" />
              </svg>
            </span>
          </div>
          <div id="clone-table" className="table-of-contents" />
        </div> */}
    </div>
  );
};

export default DetailArticle;
