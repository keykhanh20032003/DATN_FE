import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import LoadingPage from '~/components/loadingPage';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';

import './styles.css';

const Analytics = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const themeReducer = useSelector((state: RootState) => state.ThemeReducer.mode);
  const [isLoading, setIsLoading] = React.useState(false);
  const [orderPending, setOrderPending] = React.useState<number>(0);
  const [orderApproved, setOrderApproved] = React.useState<number>(0);
  const [orderShipping, setOrderShipping] = React.useState<number>(0);
  const [orderDelivered, setOrderDelivered] = React.useState<number>(0);
  const [orderRefuse, setOrderRefuse] = React.useState<number>(0);
  const [orderCancel, setOrderCancel] = React.useState<number>(0);

  const getOrder = async (status) => {
    if (!!token) {
      try {
        setIsLoading(true);
        const url = Api.countOrders(status);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setIsLoading(false);
          const data = res.data;
          if (status === 1) {
            setOrderPending(data);
          } else if (status === 2) {
            setOrderApproved(data);
          } else if (status === 3) {
            setOrderShipping(data);
          } else if (status === 4) {
            setOrderDelivered(data);
          } else if (status === 5) {
            setOrderRefuse(data);
          } else if (status === 0) {
            setOrderCancel(data);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  React.useEffect(() => {
    getOrder(0);
    getOrder(1);
    getOrder(2);
    getOrder(3);
    getOrder(4);
    getOrder(5);
  }, []);

  const chartOptions = {
    series: [
      {
        name: 'Tổng số đơn',
        data: [
          Number(orderPending),
          Number(orderApproved),
          Number(orderShipping),
          Number(orderDelivered),
          Number(orderRefuse),
          Number(orderCancel),
        ],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          cssClass: 'custom-chart',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['Chưa xác nhận', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Giao không thành công', 'Đã hủy'],
      },
      title: {
        text: 'Thống kê đơn hàng',
        align: 'left',
      },
    },
  };
  return (
    <div>
      {isLoading && <LoadingPage />}
      <h2 className="page-header text-xl font-bold">Phân tích</h2>
      <div className="row">
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
              type="bar"
              height="350"
            />
          </div>
        </div>
        <div className="col-6"></div>
        <div className="col-4"></div>
        <div className="col-8"></div>
      </div>
    </div>
  );
};

export default Analytics;
