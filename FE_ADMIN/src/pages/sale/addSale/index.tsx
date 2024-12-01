import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '~/redux/reducers';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { formatDate } from '~/constants/formatDate';

const AddSale = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [discount, setDiscount] = React.useState<number>();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const handleCreateSale = async () => {
    if (!!token) {
      if (!name) {
        toast.error(`Hãy nhập tên chương trình khuyến mãi`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!discount) {
        toast.error(`Hãy nhập % giảm giá`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (isNaN(Number(discount)) || Number(discount) < 0 || Number(discount) > 100) {
        toast.error(`Giá trị từ 0 - 100 %`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (startDate > endDate) {
        toast.error(`Ngày kết thúc không thể nhỏ hơn ngày bắt đầu`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      const data = {
        name: name,
        discount: discount,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      };
      try {
        const url = Api.createSale();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);
        console.log(res);

        if (res.status) {
          navigate(-1);
          toast.success(`Tạo mới khuyến mãi thành công`, {
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

  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thêm mới khuyến mãi</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Tên khuyến mãi</div>
          <div className="w-[70%] flex items-center">
            <input
              className="w-[80%] rounded-lg h-9 pl-2 border-[#737373]"
              placeholder="Tên khuyến mãi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-normal mt-3">
          <div className="w-[30%] text-center text-black font-bold">Giảm giá</div>
          <div className="w-[39%] flex items-center rounded-lg border-[2px] border-[#737373] hover:border-blue">
            <input
              className="w-[90%] h-9 pl-2 rounded-lg hover:border-none focus:border-none"
              placeholder="Nhập phần trăm giảm giá"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <span className="font-normal text-base decoration-black">%</span>
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Ngày bắt đầu khuyến mãi</div>
          <div className="w-[70%] flex items-center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              timeInputLabel="Time:"
              dateFormat="dd/MM/yyyy h:mm:ss aa"
              showTimeInput
              placeholderText="Nhập vào ngày bắt đầu khuyến mãi"
              className="rounded-lg h-9 pl-2 border-[#737373] w-[200%]"
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Ngày kết thúc khuyến mãi</div>
          <div className="w-[70%] flex items-center">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              timeInputLabel="Time:"
              dateFormat="dd/MM/yyyy h:mm:ss aa"
              showTimeInput
              placeholderText="Nhập vào ngày kết thúc khuyến mãi"
              className="rounded-lg h-9 pl-2 border-[#737373] w-[200%]"
            />
          </div>
        </div>

        <div className="flex items-center justify-center mt-3 ml-[15%]">
          <div
            className="w-[30%] flex justify-center items-center bg-blue rounded-md h-10 cursor-pointer"
            onClick={() => handleCreateSale()}
          >
            <span>Tạo mới</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSale;
