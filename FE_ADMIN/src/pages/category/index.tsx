import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { toast } from 'react-toastify';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import SpinLoading from '~/components/loading/spinLoading';
import Modal from 'react-modal';
import { Category } from '~/types/category.type';
import { API_URL_IMAGE } from '~/constants/utils';
import Pagination from '~/components/paginationItems';

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
  type?: number | undefined;
}

const Category = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState('');
  const [status, setStatus] = React.useState<number>(-1);
  const [type, setType] = React.useState<number>(-1);
  const [sortBy, setSortBy] = React.useState('id');
  const [totalPage, setTotalPage] = React.useState(1);
  const [sortDirection, setSortDirection] = React.useState();
  const navigate = useNavigate();
  const [loadding, setLoading] = React.useState(false);
  const [category, setCategory] = React.useState<Category[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState<number>();
  const [categoriesMapping, setCategoriesMapping] = React.useState({});
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
    { id: 2, title: 'Sản Phẩm', type: 0 },
    { id: 3, title: 'Chính Sách', type: 1 },
    { id: 4, title: 'Bài Viết', type: 2 },
    { id: 5, title: 'Tuyển Dụng', type: 3 },
  ];
  const handleChooseFilter = (item) => {
    if (item.id === -1 || item.id === 0 || item.id === 1) {
      setStatus(item.id);
      setType('');
    } else {
      setStatus('');
      setType(item.type);
    }
    setChooseFilter(item.id);
    setShowFilter(false);
  };

  const openModal = (id: number) => {
    setCategoryId(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
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
    } else {
      toast.error(`Vui lòng đăng nhập lại`, {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  React.useEffect(() => {
    if (category.length > 0) {
      category.forEach(async (item) => {
        if (item.categoryParent !== null) {
          await getCategory(item.categoryParent);
        }
      });
    }
  }, [category]);

  const getAllCategory = async () => {
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
        if (type !== -1) {
          params.type = type;
        }
        const url = Api.getAllCategory(params);
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
          setCategory(newData);
          const totalPages = Math.ceil(res.data.total / res.data.perPage);
          setTotalPage(totalPages);
          setPage(res.data.currentPage);
        } else {
          setLoading(true);
          setCategory([]);
          toast.error(`Không có danh mục nào phù hợp`, {
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
    getAllCategory();
  }, []);
  const handlePageClick = (page) => {
    setPage(page);
  };
  React.useEffect(() => {
    getAllCategory();
  }, [page, status, type, sortBy, sortDirection]);
  const hideCategory = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.hideCategory(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
          }),
        ]);
        if (res.status) {
          getAllCategory();
          toast.success(`${res.data}`, {
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
    } else {
      toast.error(`Vui lòng đăng nhập lại`, {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  const showCateory = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.showCategory(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
          }),
        ]);
        if (res.status) {
          getAllCategory();
          toast.success(`${res.data}`, {
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
    } else {
      toast.error(`Vui lòng đăng nhập lại`, {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  const deleteCategory = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.deleteCategory(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'delete',
            token: token,
          }),
        ]);
        console.log(res);

        if (res.status) {
          getAllCategory();
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
    } else {
      toast.error(`Vui lòng đăng nhập lại`, {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-base font-bold">Quản lý danh mục</span>
          <div className="flex ml-5 items-center justify-center">
            <input
              className="h-10 border-black rounded-lg pl-3"
              placeholder="Nhập tên danh mục ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <i
              className="bx bx-search text-2xl text-blue ml-3 cursor-pointer"
              onClick={() => {
                getAllCategory(), setKeyword('');
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
            onClick={() => navigate(path.addCategory)}
          >
            <i className="bx bxs-plus-circle text-2xl text-white"></i>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-black mt-5"></div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead className="border-black border-b-[1px]">
            <tr>
              <th
                className="w-[5%]"
                onClick={() => {
                  setSortBy('id'), setSortDirection(!sortDirection);
                }}
              >
                Mã <i className="bx bx-sort text-blue text-base"></i>
              </th>
              <th
                className="w-[20%] text-center"
                onClick={() => {
                  setSortBy('title'), setSortDirection(!sortDirection);
                }}
              >
                Tên danh mục <i className="bx bx-sort text-blue text-base"></i>
              </th>
              <th className="w-[10%]">Hình ảnh</th>
              <th className="w-[20%] text-center">Danh mục cha</th>
              <th className="w-[20%] text-center">Loại danh mục</th>
              <th className="w-[15%]">Trạng thái</th>
              <th className="w-[15%] text-center">Hành động</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!!category &&
              !!category.length &&
              category.map((item, i) => {
                return (
                  <tr key={i} className="cursor-pointer border-black border-b-[1px] last:border-none">
                    <td>{item.id}</td>
                    <td className="text-center">{item.title}</td>
                    <td className="">
                      {item.urlImage ? (
                        <img src={`${API_URL_IMAGE}${item.urlImage}`} className="w-20 h-20 object-contain" />
                      ) : (
                        <></>
                      )}
                    </td>
                    <td className="text-center">
                      {item.categoryParent ? <>{categoriesMapping[item.categoryParent]}</> : <>Danh mục cha</>}
                    </td>
                    <td className="text-center">
                      {item.type == 0 && 'Sản phẩm'}
                      {item.type == 1 && 'Chính sách'}
                      {item.type == 2 && 'Bài viết'}
                      {item.type == 3 && 'Tuyển dụng'}
                    </td>
                    {item.status === 1 && (
                      <td className="text-green-500">
                        <div className="flex items-center justify-between">
                          Hoạt động{' '}
                          <i className="bx bxs-lock text-xl text-red-500" onClick={() => hideCategory(item.id)}></i>
                        </div>
                      </td>
                    )}
                    {item.status === 0 && (
                      <td className="text-red-500">
                        <div className="flex items-center justify-between">
                          Đã khóa{' '}
                          <i
                            className="bx bxs-lock-open text-xl text-green-500"
                            onClick={() => showCateory(item.id)}
                          ></i>
                        </div>
                      </td>
                    )}
                    <td className="flex flex-col items-center">
                      <i
                        className="bx bxs-show text-2xl font-semibold text-blue"
                        onClick={() => navigate(path.detailCategory, { state: { item } })}
                      ></i>
                      <i
                        className="bx bxs-pencil text-2xl font-semibold text-blue pt-2"
                        onClick={() => navigate(path.editCategory, { state: item.id })}
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
          <h2 className="text-red-500">Bạn có chắc chắn muốn xóa danh mục này</h2>
          <p className="text-sm text-black">
            Nếu bạn xóa danh mục này thì tất cả dữ liệu liên quan đến danh mục này đều bị xóa!
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
              onClick={() => deleteCategory(categoryId)}
            >
              <span>Xóa</span>
            </div>
          </div>
        </div>
      </Modal>
      {loadding && <SpinLoading />}
    </div>
  );
};

export default Category;
