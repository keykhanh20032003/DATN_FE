import React from 'react';
import { useNavigate } from 'react-router-dom';
import articleApi from '~/apis/article.apis';
import Breadcrum from '~/components/breadcrumb';
import Pagination from '~/components/paginationItems';
import SpinLoading from '~/components/spinloading';
import { formatDateNumber, formatDateString } from '~/constants/formatDate';
import path from '~/constants/path';
import { API_URL_IMAGE } from '~/constants/utils';
import { Article } from '~/types/article.type';

const Articles = () => {
  const navigate = useNavigate();
  const [articleNewest, setArticleNewest] = React.useState<Article[]>([]);
  const [showNewest, setShowNewest] = React.useState(true);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const getArticles = async () => {
    try {
      setIsLoading(true);
      const params = {
        pageNo: page,
      };
      const res = await articleApi.allArticle(params);
      if (res.data.status) {
        setArticles(res.data.data.data);
        const totalPages = Math.ceil(res.data.data.total / res.data.data.perPage);
        setTotalPage(totalPages);
        setPage(res.data.data.currentPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    getArticles();
  }, []);
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
    getArticleNewest();
  }, []);

  const handlePageClick = (page) => {
    setPage(page);
  };
  return (
    <div className="layout-blogs">
      <Breadcrum title={'Bài viết'} />
      <div className="container">
        {isLoading && <SpinLoading />}
        <div className="row">
          <div className="col-lg-9 col-md-12 col-12 column-left mg-page">
            <div className="heading-page">
              <h1>Bài viết</h1>
            </div>
            <div className="row blog-posts">
              {/* Begin: Nội dung blog */}
              {!!articles &&
                !!articles.length &&
                articles.map((item, i) => {
                  return (
                    <article className="article-loop col-lg-4 col-md-6 col-12" key={i}>
                      <div className="article-inner">
                        <div className="article-image">
                          <a
                            onClick={() => navigate(path.detailArticle, { state: item.id })}
                            className="blog-post-thumbnail cursor-pointer"
                            title={item.title}
                            rel="nofollow"
                          >
                            <img src={`${API_URL_IMAGE}${item.image}`} className=" lazyloaded" alt={item.title} />
                          </a>
                        </div>
                        <div className="article-detail">
                          <div className="article-title">
                            <h3 className="post-title">
                              <a
                                onClick={() => navigate(path.detailArticle, { state: item.id })}
                                title={item.title}
                                className="cursor-pointer"
                              >
                                {item.title}
                              </a>
                            </h3>
                          </div>
                          <p className="entry-content" dangerouslySetInnerHTML={{ __html: item.shortContent }}></p>
                          <div className="article-post-meta">
                            <span className="author">bởi: {item.author}</span>
                            <span className="date">
                              <time>{formatDateString(item.modifiedDate)}</time>
                            </span>
                            {/* <span className="comment">
                        <i className="comment-icon fa fa-comment-o" />
                        <a href="/blogs/news/mau-chan-vay-da-mua-dong-xinh-xan-cho-nhung-ngay-dong">
                          0<span> Bình luận</span>
                        </a>
                      </span> */}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
            <Pagination page={page} totalPage={totalPage} handlePageClick={handlePageClick} />
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
                          if (i > 5) return;
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
                        })}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;
