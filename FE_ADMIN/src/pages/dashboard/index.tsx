import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Badge from '~/components/badge';
import StatusCard from '~/components/statuscard';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { formatPrice } from '~/constants/utils';
import LoadingPage from '~/components/loadingPage';
import path from '~/constants/path';
import { Order } from '~/types/order.type';
import { User } from '~/types/user.type';
import './styles.css';

interface ITopUser {
  id: number;
  username: string;
  totalOrder: number;
  totalIncome: number;
}
interface IOrderByMonth {
  month: string;
  orderCount: number;
  status: number;
}
const Dashboard = () => {
  const themeReducer = useSelector((state: RootState) => state.ThemeReducer.mode);
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const [countOrders, setCountOrders] = React.useState();
  const [totalProduct, setToTalProduct] = React.useState();
  const [totalInCome, setTotalInCome] = React.useState();
  const [totalOrderNoProcess, setTotalOrderNoProcess] = React.useState();
  const [topUser, setTopUser] = React.useState<ITopUser[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [user, setUser] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [orderByMonthSuccess, setOrderByMonthSuccess] = React.useState<IOrderByMonth[]>([]);
  const [orderByMonthUnSuccess, setOrderByMonthUnSuccess] = React.useState<IOrderByMonth[]>([]);

  const getCountOrders = async () => {
    if (!!token) {
      try {
        setIsLoading(true);
        const url = Api.countOrders(4);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setCountOrders(res.data);
        } else {
          toast.error(`Có lỗi xảy ra`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const getTotalProduct = async () => {
    if (!!token) {
      try {
        const url = Api.totalProduct();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setToTalProduct(res.data);
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
  const getTotalInCome = async () => {
    if (!!token) {
      try {
        const url = Api.totalInCome();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setTotalInCome(res.data);
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
  const getTotalOrderNoProcesse = async () => {
    if (!!token) {
      try {
        const url = Api.totalOrderNoProcess();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setTotalOrderNoProcess(res.data);
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
  const findTopUser = async () => {
    if (!!token) {
      try {
        const url = Api.findTopUser();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setTopUser(res.data);
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
  const getAllOrders = async () => {
    if (!!token) {
      try {
        const params = {
          keyword: '',
          pageNo: 1,
          sortBy: 'id',
          sortDirection: 'asc',
        };
        const url = Api.getAllOrders(params);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          const newData = res.data.data.map((item) => {
            return {
              ...item,
            };
          });
          setOrders(newData);
        } else {
          setOrders([]);
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
          setUser((prevMapping) => ({
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
  const getOrderByMonthSuccess = async () => {
    if (!!token) {
      try {
        const url = Api.getOrderByMonth(4);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setOrderByMonthSuccess(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const getOrderByMonthUnSuccess = async () => {
    if (!!token) {
      try {
        const url = Api.getOrderByMonth(5);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setOrderByMonthUnSuccess(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    getCountOrders();
    getTotalProduct();
    getTotalInCome();
    getTotalOrderNoProcesse();
    findTopUser();
    getOrderByMonthSuccess();
    getOrderByMonthUnSuccess();
    getAllOrders();
  }, []);
  React.useEffect(() => {
    if (orders.length > 0) {
      orders.forEach(async (item) => {
        if (item.user != null && item.user !== 0) {
          await getUser(item.user);
        }
      });
    }
  }, [orders]);
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
  const statusCards = [
    {
      icon: 'bx bx-shopping-bag',
      title: 'Tổng số đơn hàng đã giao',
      count: countOrders || '0',
    },
    {
      icon: 'bx bx-cart',
      count: totalProduct || '0',
      title: 'Tổng số sản phẩm đang bán',
    },
    {
      icon: 'bx bx-dollar-circle',
      count: formatPrice(Number(totalInCome)) || '0đ',
      title: 'Tổng thu nhập',
    },
    {
      icon: 'bx bx-receipt',
      count: totalOrderNoProcess || '0',
      title: 'Tổng đơn hàng cần được xử lý',
    },
  ];
  const chartOptions = {
    series: [
      {
        name: 'Đơn hàng thành công',
        data: [40, 70, 20, 90, 36, 80, 30, 91, 60, 0, 0, 0],
      },
      {
        name: 'Đơn hàng không thành công',
        data: [40, 30, 70, 80, 40, 16, 40, 20, 0, 0, 0, 0],
      },
    ],
    options: {
      colors: ['#2999ff', '#ff0000'],
      chart: {
        background: 'transparent',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12',
        ],
      },
      title: {
        text: 'Thống kê đơn hàng',
        align: 'left',
      },
      legend: {
        position: 'top',
      },
      grid: {
        show: false,
      },
    },
  };

  // Năm bắt đầu và kết thúc
  const startYear = 2023;
  const endYear = new Date().getFullYear() + 1; // Tính năm hiện tại và thêm 1 năm để có năm kết thúc

  const months = [];

  // Lặp qua từng năm
  for (let year = startYear; year <= endYear; year++) {
    // Lặp qua từng tháng trong năm
    for (let month = 1; month <= 12; month++) {
      const monthString = `${year}-${month.toString().padStart(2, '0')}`;
      months.push(monthString);
    }
  }
  const successfulOrdersData = new Array(12).fill(0);
  const unsuccessfulOrdersData = new Array(12).fill(0);
  // Xử lý dữ liệu từ orderByMonth
  orderByMonthSuccess.forEach((item) => {
    const index = months.indexOf(item.month);
    if (index !== -1) {
      successfulOrdersData[index] = item.orderCount;
    }
  });
  orderByMonthUnSuccess.forEach((item) => {
    const index = months.indexOf(item.month);
    if (index !== -1) {
      unsuccessfulOrdersData[index] = item.orderCount;
    }
  });
  // Cập nhật dữ liệu cho chartOptions
  chartOptions.series[0].data = successfulOrdersData;
  chartOptions.series[1].data = unsuccessfulOrdersData;

  return (
    <div>
      {isLoading && <LoadingPage />}
      <h2 className="page-header text-xl font-bold">Trang tổng quan</h2>
      <div className="row">
        <div className="col-6">
          <div className="row">
            {statusCards.map((item, index) => (
              <div className="col-6" key={index}>
                <StatusCard icon={item.icon} count={item.count} title={item.title} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-6">
          <div className="card full-height">
            {/* chart */}
            <Chart
              options={
                themeReducer === 'theme-mode-dark'
                  ? {
                      ...chartOptions.options,
                      theme: { mode: 'dark' },
                    }
                  : {
                      ...chartOptions.options,
                      theme: { mode: 'light' },
                    }
              }
              series={chartOptions.series}
              type="line"
              height="100%"
            />
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card__header">
              <h3>Top người dùng mua hàng nhiều nhất</h3>
            </div>
            <div className="card__body">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th className="text-center">Tên Tài Khoản</th>
                      <th className="text-center">Số Đơn Hàng</th>
                      <th className="text-center">Tổng Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!!topUser &&
                      !!topUser.length &&
                      topUser.map((item, i) => (
                        <tr key={i}>
                          <td className="text-center">{item.username}</td>
                          <td className="text-center">{item.totalOrder}</td>
                          <td className="text-center">{formatPrice(item.totalIncome)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="card">
            <div className="card__header">
              <h3>Đơn hàng mới nhất</h3>
            </div>
            <div className="card__body">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th className="text-center">Mã Đơn Hàng</th>
                      <th className="text-center">Tài Khoản</th>
                      <th className="text-center">Tổng Tiền</th>
                      <th className="text-center">Ngày Đặt</th>
                      <th className="text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!!orders &&
                      !!orders.length &&
                      orders.map((item, i) => {
                        if (i > 5) {
                          return;
                        }
                        return (
                          <tr key={i}>
                            <td className="text-center">{item.codeOrders}</td>
                            <td className="text-center">{user[item.user]}</td>
                            <td className="text-center">{formatPrice(totalCost(item.id))}</td>
                            <td className="text-center">{item.orderDate}</td>
                            {item.status === 1 && <td className="text-orange-500 text-center">Chờ xác nhận</td>}
                            {item.status === 2 && <td className="text-green-500 text-center">Đã xác nhận</td>}
                            {item.status === 3 && <td className="text-cyan-500 text-center">Đang vận chuyển</td>}
                            {item.status === 4 && <td className="text-blue text-center">Đã giao</td>}
                            {item.status === 5 && <td className="text-red-500 text-center">Không nhận hàng</td>}
                            {item.status === 0 && <td className="text-red-500 text-center">Đã hủy</td>}
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card__footer">
              <Link to={path.orders}>Xem tất cả</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
