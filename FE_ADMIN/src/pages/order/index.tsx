import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { toast } from 'react-toastify';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { useNavigate } from 'react-router-dom';
import path from '~/constants/path';
import { formatPrice } from '~/constants/utils';
import SpinLoading from '~/components/loading/spinLoading';
import { Order } from '~/types/order.type';
import { City, District, Ward } from '~/types/province.type';
import provinceApi from '~/api/province.apis';
import DatePicker from 'react-datepicker';
import { formatDate, formatDateSearch } from '~/constants/formatDate';
import Pagination from '~/components/paginationItems';
import Images from '~/assets';
import LoadingPage from '~/components/loadingPage';

interface Params {
  keyword: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
  pageNo: number;
  isCheckout?: number | undefined;
  sortBy: string;
  sortDirection: string;
  status?: number | undefined;
}

const Order = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const [page, setPage] = React.useState(1);
  const [keyword, setKeyword] = React.useState('');
  const navigate = useNavigate();
  const [loadding, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [status, setStatus] = React.useState<number>(-1);
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [sortBy, setSortBy] = React.useState('id');
  const [isCheckout, setIsCheckout] = React.useState(null);
  const [totalPage, setTotalPage] = React.useState(1);
  const [sortDirection, setSortDirection] = React.useState();
  const [chooseFilter, setChooseFilter] = React.useState(null);
  const [showFilter, setShowFilter] = React.useState(false);
  const showFilterRef = React.useRef(null);
  const [isNone, setIsNone] = React.useState(false);
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
  const options = [
    { title: 'Tất Cả', id: -1 },
    { title: 'Chờ Xác Nhận', id: 1 },
    { title: 'Đã Xác Nhận', id: 2 },
    { title: 'Đang Giao', id: 3 },
    { title: 'Đã Giao', id: 4 },
    { title: 'Đã Hủy', id: 0 },
    { title: 'Không nhận hàng', id: 5 },
    { title: 'Đã Thanh Toán', id: 6 },
    { title: 'Chưa Thanh Toán', id: 7 },
    { title: 'Mới nhất', id: 8 },
    { title: 'Cũ nhất', id: 9 },
  ];
  const handleChooseFilter = (item) => {
    if (item.id === 6) {
      setIsCheckout(1);
      setStatus(-1);
    } else if (item.id === 7) {
      setIsCheckout(0);
      setStatus(-1);
    } else if (item.id === 8) {
      setSortDirection('asc');
    } else if (item.id === 9) {
      setSortDirection('desc');
    } else {
      setStatus(item.id);
      setIsCheckout(null);
    }
    setChooseFilter(item.id);
    setShowFilter(false);
  };
  const getAllOrders = async () => {
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
        if (isCheckout !== null) {
          params.isCheckout = isCheckout;
        }
        if (startDate && endDate) {
          params.startDate = formatDateSearch(startDate);
          params.endDate = formatDateSearch(startDate);
        }
        const url = Api.getAllOrders(params);
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
          setOrders(newData);
          const totalPages = Math.ceil(res.data.total / res.data.perPage);
          setTotalPage(totalPages);
          setPage(res.data.currentPage);
          setIsNone(false);
        } else {
          setOrders([]);
          setTotalPage(0);
          setIsNone(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    getAllOrders();
  }, []);

  const handlePageClick = (page) => {
    setPage(page);
  };

  React.useEffect(() => {
    getAllOrders();
  }, [page, status, isCheckout, sortBy, sortDirection]);

  const totalCost = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return 0; // Không tìm thấy đơn hàng, tổng tiền là 0
    }
    const itemTotalCost = order.items.reduce((total, item) => {
      const itemCost = item.sellPrice * item.quantity;
      return total + itemCost;
    }, 0);
    const totalCost = itemTotalCost + order.shippingFee;
    return totalCost;
  };
  const [cityMap, setCityMap] = React.useState({});
  const [wardMap, setWardMap] = React.useState({});
  const [districtMap, setDistrictMap] = React.useState({});

  const getCities = async () => {
    try {
      const res = await provinceApi.cityApi();
      if (res.status === 200) {
        const newCity = res.data.map((city) => ({
          code: city.code,
          name: city.name,
        }));
        newCity.forEach((city) => {
          setCityMap((prevMapping) => ({
            ...prevMapping,
            [city.code]: city.name,
          }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getDistricts = async (id) => {
    try {
      setLoading(true);
      const res = await provinceApi.districtApi(id);
      if (res.status === 200) {
        const newDistrict = res.data.districts.map((district) => ({
          code: district.code,
          name: district.name,
        }));
        newDistrict.forEach((district) => {
          setDistrictMap((prevMapping) => ({
            ...prevMapping,
            [district.code]: district.name,
          }));
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getWards = async (id) => {
    try {
      const res = await provinceApi.wardApi(id);
      if (res.status === 200) {
        const newWards = res.data.wards.map((ward) => ({
          code: ward.code,
          name: ward.name,
        }));
        newWards.forEach((ward) => {
          setWardMap((prevMapping) => ({
            ...prevMapping,
            [ward.code]: ward.name,
          }));
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    getCities();
  }, []);
  React.useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(async (item) => {
        if (item.district !== null && item.district !== undefined && !Number.isNaN(item.district)) {
          await getWards(parseInt(item.district));
        }
      });
    }
  }, [orders]);
  React.useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(async (item) => {
        if (item.province !== null && item.province !== undefined && !Number.isNaN(item.province)) {
          await getDistricts(parseInt(item.province));
        }
      });
    }
  }, [orders]);
  const handleEdit = (item) => {
    if (item.status === 1 || item.status === 2) {
      navigate(path.editOrder, { state: item.id });
    } else {
      toast.error(`Không thể sửa đơn hàng này`, {
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-base font-bold">Quản lý đơn hàng</span>
          <div className="flex ml-5 items-center justify-center">
            <input
              className="h-10 border-black rounded-lg pl-3"
              placeholder="Nhập mã đơn hàng ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <i
              className="bx bx-search text-2xl text-blue ml-3 cursor-pointer"
              onClick={() => {
                getAllOrders(), setKeyword('');
              }}
            ></i>
          </div>
        </div>
        <div className="flex items-center justify-around w-[40%]">
          {/* filter  */}
          <div className="w-10 h-10 rounded-md mr-2 relative bg-blue flex items-center justify-center">
            <i
              ref={showFilterRef}
              className="bx bx-filter text-white text-4xl cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            ></i>
            {showFilter && (
              <ul className="absolute top-[70%] right-0 translate-y-4 transition-transform px-2 w-40 bg-blue rounded-md flex flex-col items-center justify-center">
                {options.map((option, index) => (
                  <React.Fragment key={index}>
                    <li
                      className={`py-2 cursor-pointer ${
                        chooseFilter === option.id ? 'text-black font-semibold' : 'text-white'
                      }`}
                      onClick={() => handleChooseFilter(option)}
                    >
                      {option.title}
                    </li>
                    {index !== options.length - 1 && <div className="w-full bg-white h-[1px]"></div>}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
          {/* chọn ngày  */}
          <div className="flex justify-end">
            <div className="w-[60%]">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd-MM-yyyy"
                showTimeInput
                placeholderText="Ngày bắt đầu"
                className="rounded-lg h-10 pl-2 border-[#737373] mr-3 w-[90%]"
              />
            </div>
            <div className="w-[60%]">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd-MM-yyyy"
                showTimeInput
                placeholderText="Ngày kết thúc"
                className="rounded-lg h-10 pl-2 border-[#737373] mr-3 w-[90%]"
              />
            </div>
            <i
              className="bx bx-search text-2xl text-blue mr-3 cursor-pointer"
              onClick={() => {
                getAllOrders(), setStartDate(''), setEndDate('');
              }}
            ></i>
          </div>
          <div className="w-auto px-2 py-1 cursor-pointer flex justify-center items-center bg-blue rounded-md">
            <i className="bx bxs-plus-circle text-2xl text-white"></i>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-black mt-5"></div>
      <div className="overflow-x-auto w-full">
        {isNone ? (
          <div className="flex flex-col items-center mt-3">
            <span className="text-black text-xl">Không có đơn hàng nào</span>
            <img src={Images.iconNull} className="object-contain w-80 h-80" />
          </div>
        ) : (
          <table className="table w-full">
            <thead className="border-black border-b-[1px]">
              <tr>
                <th className="w-[15%] text-center">Mã đơn hàng</th>
                <th className="w-[15%] text-center">Người nhận</th>
                <th className="w-[15%] text-center">Số điện thoại</th>
                <th className="w-[15%] text-center">Địa chỉ</th>
                <th className="w-[10%] text-center">Đơn giá</th>
                <th className="w-[10%] text-center">Thanh toán</th>
                <th className="w-[10%] text-center">Trạng thái</th>
                <th className="w-[10%] text-center">Ngày giao</th>
                <th className="w-[10%] text-center"></th>
              </tr>
            </thead>
            <tbody>
              {!!orders &&
                !!orders.length &&
                orders.map((item, i) => {
                  return (
                    <tr key={i} className="cursor-pointer border-black border-b-[1px] last:border-none">
                      <td className="text-center">{item.codeOrders}</td>
                      <td className="text-center">{item.fullName}</td>
                      <td className="text-center">{item.phone}</td>
                      <td className="text-center">
                        {item.addressDetail}, {wardMap[item.wards]}, {districtMap[item.district]},{' '}
                        {cityMap[item.province]}
                      </td>
                      <td className="text-center">{formatPrice(totalCost(item.id))}</td>
                      <td className={item.isCheckout ? `text-center text-green-500` : `text-red-500 text-center`}>
                        {item.isCheckout ? `Đã thanh toán` : `Chưa thanh toán`}
                      </td>
                      {item.status === 1 && <td className="text-orange-500 text-center">Chờ xác nhận</td>}
                      {item.status === 2 && <td className="text-green-500 text-center">Đã xác nhận</td>}
                      {item.status === 3 && <td className="text-cyan-500 text-center">Đang vận chuyển</td>}
                      {item.status === 4 && <td className="text-blue text-center">Đã giao</td>}
                      {item.status === 5 && <td className="text-red-500 text-center">Không nhận hàng</td>}
                      {item.status === 0 && <td className="text-red-500 text-center">Đã hủy</td>}
                      <td className="text-center">{item.shipDate ? `${item.shipDate}` : `Chưa xác định`}</td>
                      <td className="flex flex-col items-center justify-between ">
                        <i
                          className="bx bxs-show text-2xl font-semibold text-blue"
                          onClick={() => navigate(path.detailOrder, { state: item.id })}
                        ></i>
                        <i
                          className="bx bxs-pencil text-2xl font-semibold text-blue pt-2"
                          onClick={() => handleEdit(item)}
                        ></i>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
      <Pagination totalPage={totalPage} page={page} handlePageClick={handlePageClick} />
      {loadding && <SpinLoading />}
    </div>
  );
};

export default Order;
