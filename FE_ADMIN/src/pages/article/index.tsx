import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { toast } from 'react-toastify';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import SpinLoading from '~/components/loading/spinLoading';
import Modal from 'react-modal';
import { Article } from '~/types/article.type';
import { Category } from '~/types/category.type';
import Pagination from '~/components/paginationItems';
import LoadingPage from '~/components/loadingPage';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
interface Params {
  keyword: string;
  pageNo: number;
  sortBy: string;
  sortDirection: string;
  status?: number | undefined;
}
const Article = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState<number>(-1);
  const [sortBy, setSortBy] = React.useState('id');
  const [totalPage, setTotalPage] = React.useState(1);
  const [sortDirection, setSortDirection] = React.useState();
  const [keyword, setKeyword] = React.useState('');
  const navigate = useNavigate();
  const [categoriesMapping, setCategoriesMapping] = React.useState({});
  const [userMapping, setUserMapping] = React.useState({});
  const [loadding, setLoading] = React.useState(false);
  const [chooseFilter, setChooseFilter] = React.useState(null);
  const [showFilter, setShowFilter] = React.useState(false);
  const showFilterRef = React.useRef(null);
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (showFilterRef.current && !showFilterRef.current.contains(event.target)) {
        // Nếu sự kiện click xảy ra bên ngoài div, đóng dropdown
        setShowFilter(false);
      }
    }
    // Đăng ký sự kiện click trên document
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const filterOptions = [
    { id: -1, title: 'Tất Cả' },
    { id: 1, title: 'Hoạt Động' },
    { id: 0, title: 'Đã Khóa' },
  ];
  const handleChooseFilter = (item) => {
    setStatus(item.id);
    setChooseFilter(item.id);
    setShowFilter(false);
  };

  const [article, setArticle] = React.useState<Article[]>([]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [articleId, setArticleId] = React.useState<number>();

  const openModal = (id: number) => {
    setArticleId(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const getAllArticle = async () => {
    if (!!token) {
      try {
        setLoading(true);
        const params: Params = {
          keyword: keyword,
          pageNo: page,
          sortBy: sortBy,
          sortDirection: sortDirection || 'desc',
        };
        if (status !== -1) {
          params.status = status;
        }
        const url = Api.getAllArticle(params);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setLoading(false);
          const newData = res.data.data.map((item) => {
            return {
              ...item,
            };
          });
          setArticle(newData);
          const totalPages = Math.ceil(res.data.total / res.data.perPage);
          setTotalPage(totalPages);
          setPage(res.data.currentPage);
        } else {
          setLoading(true);
          setArticle([]);
          toast.error(`Không có bài viết nào phù hợp`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        setLoading(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    getAllArticle();
  }, []);
  const handlePageClick = (page) => {
    setPage(page);
  };
  React.useEffect(() => {
    getAllArticle();
  }, [page, status, sortBy, sortDirection]);
  const getCategory = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.detailCategory(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);

        if (res.status) {
          const category = res.data;
          setCategoriesMapping((prevMapping) => ({
            ...prevMapping,
            [category.id]: category.title,
          }));
        } else {
          toast.error(`Có lỗi xảy ra`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const getUser = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.detailAcc(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          const user = res.data;
          setUserMapping((prevMapping) => ({
            ...prevMapping,
            [user.id]: user.username,
          }));
        } else {
          toast.error(`Có lỗi xảy ra`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    if (article.length > 0) {
      article.forEach(async (item) => {
        if (item.userId != 0) {
          await getUser(item.userId);
        }
      });
    }
  }, [article]);
  React.useEffect(() => {
    if (article.length > 0) {
      article.forEach(async (item) => {
        await getCategory(item.categoryId);
      });
    }
  }, [article]);
  const hideArticle = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.hideArticle(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
          }),
        ]);
        if (res.status) {
          getAllArticle();
          toast.success(`Bài viết đã được ẩn`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
          toast.error(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const showArticle = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.showArticle(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
          }),
        ]);
        if (res.status) {
          getAllArticle();
          toast.success(`Bài viết đã được hiện`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
          toast.error(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const deleteArticle = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.deleteArticle(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'delete',
            token: token,
          }),
        ]);
        console.log(res);

        if (res.status) {
          getAllArticle();
          closeModal();
          toast.success(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
          toast.error(`Xóa sản phẩm không thành công`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-base font-bold">Quản lý bài viết</span>
          <div className="flex ml-5 items-center justify-center">
            <input
              className="h-10 border-black rounded-lg pl-3"
              placeholder="Nhập tên sản phẩm ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <i
              className="bx bx-search text-2xl text-blue ml-3 cursor-pointer"
              onClick={() => {
                getAllArticle(), setKeyword('');
              }}
            ></i>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-md mr-2 relative bg-blue flex items-center justify-center">
            <i
              ref={showFilterRef}
              className="bx bx-filter text-white text-4xl cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            ></i>
            {showFilter && (
              <ul className="absolute top-[70%] right-0 translate-y-4 transition-transform px-2 w-40 bg-blue rounded-md flex flex-col items-center justify-center">
                {filterOptions.map((option, i) => (
                  <React.Fragment key={i}>
                    <li
                      className={`py-2 cursor-pointer w-full text-center ${
                        chooseFilter === option.id ? 'text-black font-semibold' : 'text-white'
                      }`}
                      onClick={() => handleChooseFilter(option)}
                    >
                      {option.title}
                    </li>
                    {option.id !== filterOptions[filterOptions.length - 1].id && (
                      <div className="w-full bg-white h-[1px]"></div>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
          <div
            className="w-auto px-2 py-1 cursor-pointer flex justify-center items-center bg-blue rounded-md"
            onClick={() => navigate(path.addArticle)}
          >
            <i className="bx bxs-plus-circle text-2xl text-white"></i>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-black mt-5"></div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th
                className="w-[5%] text-center"
                onClick={() => {
                  setSortBy('id'), setSortDirection(!sortDirection);
                }}
              >
                Id <i className="bx bx-sort text-blue text-xl"></i>
              </th>
              <th
                className="w-[20%] text-center"
                onClick={() => {
                  setSortBy('title'), setSortDirection(!sortDirection);
                }}
              >
                Tiêu đề <i className="bx bx-sort text-blue text-xl"></i>
              </th>
              <th
                className="w-[20%] text-center"
                onClick={() => {
                  setSortBy('shortContent'), setSortDirection(!sortDirection);
                }}
              >
                Mô tả ngắn <i className="bx bx-sort text-blue text-xl"></i>
              </th>
              <th
                className="w-[10%] text-center"
                onClick={() => {
                  setSortBy('author'), setSortDirection(!sortDirection);
                }}
              >
                Tác giả <i className="bx bx-sort text-blue text-xl"></i>
              </th>
              <th className="w-[10%] text-center">Người tạo</th>
              <th className="w-[10%] text-center">Danh mục</th>
              <th className="w-[10%] text-center">Trạng thái</th>
              <th className="w-[10%] text-center">Hành động</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!!article &&
              !!article.length &&
              article.map((item, i) => {
                return (
                  <tr key={i} className="cursor-pointer">
                    <td className="text-center">{item.id}</td>
                    <td className="text-start">{item.title}</td>
                    <td
                      className="text-start max-h-[90px] line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: item?.shortContent }}
                    ></td>
                    <td className="text-center">{item.author}</td>
                    <td className="text-center">{userMapping[item.userId]}</td>
                    <td className="text-center">{categoriesMapping[item.categoryId]}</td>
                    {item.status === 1 && (
                      <td className="text-green-500">
                        <div className="flex items-center justify-between">
                          Hoạt động{' '}
                          <i className="bx bxs-lock text-xl text-red-500" onClick={() => hideArticle(item.id)}></i>
                        </div>
                      </td>
                    )}
                    {item.status === 0 && (
                      <td className="text-red-500">
                        <div className="flex items-center justify-between">
                          Đã khóa{' '}
                          <i
                            className="bx bxs-lock-open text-xl text-green-500"
                            onClick={() => showArticle(item.id)}
                          ></i>
                        </div>
                      </td>
                    )}
                    <td className="flex flex-col items-center justify-between ">
                      <i
                        className="bx bxs-show text-2xl font-semibold text-blue"
                        onClick={() => navigate(path.detailArticle, { state: item })}
                      ></i>
                      <i
                        className="bx bxs-pencil text-2xl font-semibold text-blue pt-2"
                        onClick={() => navigate(path.editArticle, { state: item.id })}
                      ></i>
                    </td>
                    <td className="">
                      <i className="bx bx-trash text-2xl text-red-500" onClick={() => openModal(item.id)}></i>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPage={totalPage} handlePageClick={handlePageClick} />
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
        <div className="w-full flex flex-col items-center justify-center">
          <h2 className="text-red-500">Bạn có chắc chắn muốn xóa sản phẩm này</h2>
          <p className="text-sm text-black">
            Nếu bạn xóa sản phẩm này thì tất cả dữ liệu liên quan đến sản phẩm này đều bị xóa!
          </p>
          <div className="flex items-center justify-around w-full mt-5">
            <div
              className="cursor-pointer w-[30%] h-10 rounded-md bg-blue flex items-center justify-center"
              onClick={closeModal}
            >
              <span>Hủy</span>
            </div>
            <div
              className="cursor-pointer w-[30%] h-10 rounded-md bg-red-500 flex items-center justify-center"
              onClick={() => deleteArticle(articleId)}
            >
              <span>Xóa</span>
            </div>
          </div>
        </div>
      </Modal>
      {loadding && <LoadingPage />}
    </div>
  );
};

export default Article;
