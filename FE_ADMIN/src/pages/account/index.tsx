import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { toast } from 'react-toastify';
import Images from '~/assets';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { User } from '~/types/user.type';
import { useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import SpinLoading from '~/components/loading/spinLoading';
import Pagination from '~/components/paginationItems';

interface Params {
  keyword: string;
  pageNo: number;
  sortBy: string;
  sortDirection: string;
  status?: number | undefined;
}
const Account = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState('');
  const [status, setStatus] = React.useState<number>(-1);
  const [sortBy, setSortBy] = React.useState('id');
  const [totalPage, setTotalPage] = React.useState(1);
  const [sortDirection, setSortDirection] = React.useState();
  const [loadding, setLoading] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [chooseFilter, setChooseFilter] = React.useState(null);
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
  const navigate = useNavigate();
  const [listUser, setListUser] = React.useState<User[]>([]);

  const getListUser = async () => {
    if (!!token) {
      try {
        setLoading(true);
        const params: Params = {
          keyword: keyword,
          pageNo: page,
          sortBy: sortBy,
          sortDirection: sortDirection || 'asc',
        };
        if (status !== -1) {
          params.status = status;
        }
        const url = Api.getListUser(params);
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
          setListUser(newData);
          const totalPages = Math.ceil(res.data.total / res.data.perPage);
          setTotalPage(totalPages);
          setPage(res.data.currentPage);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    getListUser();
  }, []);

  const handlePageClick = (page) => {
    setPage(page);
  };
  React.useEffect(() => {
    getListUser();
  }, [page, status, sortBy, sortDirection]);
  const hideUser = async (userId: number) => {
    if (!!token) {
      try {
        const url = Api.hideUser(userId, user.id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
          }),
        ]);
        if (res.status) {
          getListUser();
          toast.success(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const showUser = async (userId: number) => {
    if (!!token) {
      try {
        const url = Api.showUser(userId, user.id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
          }),
        ]);
        if (res.status) {
          getListUser();
          toast.success(`${res.data}`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        } else {
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
          <span className="text-base font-bold">Tài khoản</span>
          <div className="flex ml-5 items-center justify-center">
            <input
              className="h-10 border-black rounded-lg pl-3"
              placeholder="Nhập tên tài khoản ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <i
              className="bx bx-search text-2xl text-blue ml-3 cursor-pointer"
              onClick={() => {
                getListUser(), setKeyword('');
              }}
            ></i>
          </div>
        </div>
        <div className="flex justify-between items-center">
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
            onClick={() => navigate(path.addEmp)}
          >
            <i className="bx bxs-user-plus text-2xl text-white"></i>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-black mt-5"></div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr className="border-black border-b-[1px]">
              <th
                className="flex items-center w-[50%]"
                onClick={() => {
                  setSortBy('username'), setSortDirection(!sortDirection);
                }}
              >
                Tài khoản <i className="bx bx-sort text-blue text-xl"></i>
              </th>
              <th>Điện thoại</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>ROLE</th>
              <th className="text-center">Hành động</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!!listUser &&
              !!listUser.length &&
              listUser.map((item, i) => {
                return (
                  <tr key={i} className="cursor-pointer border-black border-b-[1px] last:border-none">
                    <td>
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-bold">{item.username}</div>
                          <div className="text-sm opacity-50">
                            {item.lastName} {item.firstName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{item.phone}</td>
                    <td>{item.createdDate}</td>
                    {item.status === 1 && (
                      <td className="text-green-500">
                        Hoạt động <i className="bx bxs-lock text-xl text-red-500" onClick={() => hideUser(item.id)}></i>
                      </td>
                    )}
                    {item.status === 0 && (
                      <td className="text-red-500">
                        Đã khóa{' '}
                        <i className="bx bxs-lock-open text-xl text-green-500" onClick={() => showUser(item.id)}></i>
                      </td>
                    )}
                    <td>{item.roles[0].name.replace('ROLE_', '')}</td>
                    <td className="flex flex-col items-center justify-between ">
                      <i
                        className="bx bxs-show text-2xl font-semibold text-blue"
                        onClick={() => navigate(path.detailAcc, { state: item.id })}
                      ></i>
                      <i
                        className="bx bxs-pencil text-2xl font-semibold text-blue pt-2"
                        onClick={() => navigate('/', { state: item.id })}
                      ></i>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPage={totalPage} handlePageClick={handlePageClick} />
      {loadding && <SpinLoading />}
    </div>
  );
};

export default Account;
