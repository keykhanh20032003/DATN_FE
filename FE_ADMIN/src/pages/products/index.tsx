import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { toast } from 'react-toastify';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import { Product, ProductImages } from '~/types/product.type';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import SpinLoading from '~/components/loading/spinLoading';
import Modal from 'react-modal';
import Pagination from '~/components/paginationItems';
import { Category } from '~/types/category.type';

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
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  categoryId?: number | undefined;
}

const Product = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState('');
  const [status, setStatus] = React.useState<number>(-1);
  const [sortBy, setSortBy] = React.useState('id');
  const [totalPage, setTotalPage] = React.useState(1);
  const [sortDirection, setSortDirection] = React.useState();
  const [minPrice, setMinPrice] = React.useState();
  const [maxPrice, setMaxPrice] = React.useState();
  const [categoryId, setCategoryId] = React.useState<number>(-1);
  const [allCategory1, setAllCategry1] = React.useState<Category[]>([]);
  const [allCategory2, setAllCategry2] = React.useState<Category[]>([]);
  const [allCategory, setAllCategry] = React.useState<Category[]>([]);
  const navigate = useNavigate();
  const [categoriesMapping, setCategoriesMapping] = React.useState({});
  const [salesMapping, setSalesMapping] = React.useState({});
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
    { id: -2, title: 'Hoạt Động' },
    { id: 0, title: 'Đã Khóa' },
    ...allCategory,
  ];
  const handleChooseFilter = (item) => {
    if (item.id === -1 || item.id === 0) {
      setStatus(item.id);
      setCategoryId('');
    } else if (item.id === -2) {
      setStatus(1);
      setCategoryId('');
    } else {
      setStatus('');
      setCategoryId(item.id);
    }
    setChooseFilter(item.id);
    setShowFilter(false);
  };
  const [product, setProduct] = React.useState<Product[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [productId, setProductId] = React.useState<number>();

  const openModal = (id: number) => {
    setProductId(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const getAllCategory = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.getAllCategoryByParentId(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          if (id === 28) {
            const category = res.data;
            setAllCategry1(category);
          } else if (id === 29) {
            const category = res.data;
            setAllCategry2(category);
          }
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
    getAllCategory(28);
    getAllCategory(29);
  }, []);
  React.useEffect(() => {
    setAllCategry([...allCategory1, ...allCategory2]);
  }, [allCategory1, allCategory2]);
  const getAllProduct = async () => {
    if (!!token) {
      try {
        setLoading(true);
        const params: Params = {
          keyword: keyword,
          pageNo: page,
          sortBy: sortBy,
          sortDirection: sortDirection || 'desc',
        };
        if (minPrice && maxPrice) {
          params.minPrice = Number(minPrice);
          params.maxPrice = Number(maxPrice);
        }
        if (status !== -1) {
          params.status = status;
        }
        if (categoryId !== -1) {
          params.categoryId = categoryId;
        }
        const url = Api.getAllProduct(params);
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
          setProduct(newData);
          const totalPages = Math.ceil(res.data.total / res.data.perPage);
          setTotalPage(totalPages);
          setPage(res.data.currentPage);
        } else {
          setProduct([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
    }
  };
  React.useEffect(() => {
    getAllProduct();
  }, []);
  const handlePageClick = (page) => {
    setPage(page);
  };
  React.useEffect(() => {
    getAllProduct();
  }, [page, status, sortBy, sortDirection, categoryId]);
  const handleFindPrice = () => {
    if (!minPrice) {
      toast.error(`Hãy nhập giá nhỏ nhất`, {
        pauseOnHover: false,
        theme: 'dark',
      });
      return;
    }
    if (!maxPrice) {
      toast.error(`Hãy nhập giá cao nhất`, {
        pauseOnHover: false,
        theme: 'dark',
      });
      return;
    }
    if (isNaN(Number(minPrice)) || isNaN(Number(maxPrice))) {
      toast.error(`Giá trị không hợp lệ`, {
        pauseOnHover: false,
        theme: 'dark',
      });
      return;
    }
    getAllProduct();
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
    }
  };
  const getSale = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.getSale(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          const sale = res.data;
          setSalesMapping((prevMapping) => ({
            ...prevMapping,
            [sale.id]: sale.name,
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
    if (product.length > 0) {
      product.forEach(async (item) => {
        if (item.sale != null && item.sale !== 0) {
          await getSale(item.sale);
        }
      });
    }
  }, [product]);
  React.useEffect(() => {
    if (product.length > 0) {
      product.forEach(async (item) => {
        await getCategory(item.category);
      });
    }
  }, [product]);
  const hideProduct = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.hideProduct(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
          }),
        ]);
        if (res.status) {
          getAllProduct();
          toast.success(`Sản phẩm đã được ẩn`, {
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
  const showProduct = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.showProduct(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
          }),
        ]);
        if (res.status) {
          getAllProduct();
          toast.success(`Sản phẩm đã được hiện`, {
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
  const deleteProduct = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.deleteProduct(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'delete',
            token: token,
          }),
        ]);
        console.log(res);

        if (res.status) {
          getAllProduct();
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
          <span className="text-base font-bold">Quản lý sản phẩm</span>
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
                getAllProduct(), setKeyword('');
              }}
            ></i>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-md mr-2 relative bg-blue flex items-center justify-center">
            <i
              ref={showFilterRef}
              className="bx bx-filter text-white text-4xl cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            ></i>
            {showFilter && (
              <ul className="absolute top-[70%] right-0 translate-y-4 transition-transform px-2 w-40 bg-blue rounded-md flex flex-col items-center justify-center">
                {filterOptions.map((option) => (
                  <React.Fragment key={option.id}>
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
          <div className="flex items-center justify-center">
            <input
              className="h-10 w-[50%] rounded-md border border-black mr-2 pl-2"
              placeholder="Giá nhỏ nhất"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              className="h-10 w-[50%] rounded-md border border-black mr-2 pl-2"
              placeholder="Giá cao nhất"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <i className="bx bx-search text-2xl text-blue mr-3 cursor-pointer" onClick={() => handleFindPrice()}></i>
          </div>

          <div
            className="w-auto px-2 py-1 cursor-pointer flex justify-center items-center bg-blue rounded-md"
            onClick={() => navigate(path.addProduct)}
          >
            <i className="bx bxs-plus-circle text-2xl text-white"></i>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-black mt-5"></div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr className="border-black border-b-[1px]">
              <th
                className="text-center"
                onClick={() => {
                  setSortBy('sku'), setSortDirection(!sortDirection);
                }}
              >
                SKU
                <i className="bx bx-sort text-blue text-base"></i>
              </th>
              <th
                className="w-[15%] text-center"
                onClick={() => {
                  setSortBy('name'), setSortDirection(!sortDirection);
                }}
              >
                Tên sản phẩm <i className="bx bx-sort text-blue text-base"></i>
              </th>
              <th className="w-[10%]">Hình ảnh</th>
              <th
                className="w-[10%] text-center"
                onClick={() => {
                  setSortBy('price'), setSortDirection(!sortDirection);
                }}
              >
                Giá bán <i className="bx bx-sort text-blue text-base"></i>
              </th>
              <th
                className="w-[10%] text-center"
                onClick={() => {
                  setSortBy('salePrice'), setSortDirection(!sortDirection);
                }}
              >
                Giá KM <i className="bx bx-sort text-blue text-base"></i>
              </th>
              <th className="w-[10%] text-center">Khuyến mãi</th>
              <th className="w-[10%] text-center">Trạng thái</th>
              <th className="w-[10%] text-center">Danh mục</th>
              <th className="w-[10%] text-center">Hành động</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!!product &&
              !!product.length &&
              product.map((item, i) => {
                return (
                  <tr key={item.id} className="cursor-pointer border-black border-b-[1px] last:border-none">
                    <td className="text-center">{item.sku}</td>
                    <td className="text-center">{item.name}</td>
                    <td className="">
                      <img src={`${API_URL_IMAGE}${item?.images[0]?.url}`} className="w-20 h-20 object-contain" />
                    </td>
                    <td className="text-center">{formatPrice(item.price)}</td>
                    <td className="text-center">{formatPrice(item.salePrice)}</td>
                    <td className="text-center">{item.sale != 0 ? `${salesMapping[item.sale]}` : `Không có`}</td>
                    {item.status === 1 && (
                      <td className="text-green-500">
                        <div className="flex items-center justify-between">
                          Hoạt động{' '}
                          <i className="bx bxs-lock text-xl text-red-500" onClick={() => hideProduct(item.id)}></i>
                        </div>
                      </td>
                    )}
                    {item.status === 0 && (
                      <td className="text-red-500">
                        <div className="flex items-center justify-between">
                          Đã khóa{' '}
                          <i
                            className="bx bxs-lock-open text-xl text-green-500"
                            onClick={() => showProduct(item.id)}
                          ></i>
                        </div>
                      </td>
                    )}
                    <td className="text-center">{categoriesMapping[item.category]}</td>
                    <td className="flex flex-col items-center justify-between ">
                      <i
                        className="bx bxs-show text-2xl font-semibold text-blue"
                        onClick={() => navigate(path.detailProduct, { state: item.id })}
                      ></i>
                      <i
                        className="bx bxs-pencil text-2xl font-semibold text-blue pt-2"
                        onClick={() => navigate(path.editProduct, { state: item.id })}
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
              onClick={() => deleteProduct(productId)}
            >
              <span>Xóa</span>
            </div>
          </div>
        </div>
      </Modal>
      <Pagination page={page} totalPage={totalPage} handlePageClick={handlePageClick} />
      {loadding && <SpinLoading />}
    </div>
  );
};

export default Product;
