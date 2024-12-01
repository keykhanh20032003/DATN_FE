import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import { Sale } from '~/types/sale.type';
import { Product } from '~/types/product.type';
import { formatDate } from '~/constants/formatDate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';
import path from '~/constants/path';

const EditSale = () => {
  const location = useLocation();
  const id = location.state;
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();
  const [sale, setSale] = React.useState<Sale>();
  const [productSale, setProductSale] = React.useState<Product[]>([]);
  const [nameSale, setNameSale] = React.useState('');
  const [discount, setDiscount] = React.useState<number>();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [startDateUD, setStartDateUD] = React.useState(new Date());
  const [endDateUD, setEndDateUD] = React.useState(new Date());
  const [isChoose, setIsChoose] = React.useState(false);
  const [productId, setProductId] = React.useState<number[]>([]);
  const [keyword, setKeyword] = React.useState('');
  const [isChoosePro, setIsChoosePro] = React.useState(false);

  const handleUpdateSale = async () => {
    if (!!token) {
      if (!nameSale) {
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
        name: nameSale,
        discount: discount,
        startDate: formatDate(startDateUD),
        endDate: formatDate(endDateUD),
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
          // navigate(-1);
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
  const getSale = async () => {
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
          setSale(res.data);
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
  const getProdctSale = async () => {
    if (!!token) {
      try {
        const url = Api.getProductSale(id, keyword);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        console.log(res);

        if (res.status) {
          setProductSale(res.data);
        } else {
          toast.error(`Khuyến mãi này chưa có sản phẩm`, {
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
    if (sale != null) {
      setNameSale(sale?.name || '');
      setDiscount(sale?.discount || null || undefined);
      setStartDate(sale?.startDate);
      setEndDate(sale?.endDate);
    }
  }, [sale]);

  React.useEffect(() => {
    getSale();
  }, []);
  React.useEffect(() => {
    getProdctSale();
  }, []);
  const handleDeleteProductSale = async () => {
    if (!!token) {
      if (!productId) {
        toast.error(`Hãy nhập tên chương trình khuyến mãi`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      try {
        const url = Api.removeProSale(id, productId);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
          }),
        ]);
        if (res.status) {
          getProdctSale();
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
    }
  };

  const handleCheckboxClick = (id: number) => {
    if (productId.includes(id)) {
      setIsChoosePro(false);
      setProductId(productId.filter((item) => item !== id));
    } else {
      setProductId([...productId, id]);
      setIsChoosePro(true);
    }
  };
  const handleSelectAll = () => {
    if (!isChoose) {
      setIsChoosePro(true);
      const allIds = productSale.map((item) => item.id);
      setProductId(allIds);
    } else {
      setProductId([]);
      setIsChoosePro(false);
    }
    setIsChoose(!isChoose);
  };
  const isAllSelected = productId.length === productSale.length;

  React.useEffect(() => {
    if (productSale.length > 0) {
      setIsChoose(isAllSelected);
    }
  }, [productId]);

  return (
    <>
      <div className="flex mt-0">
        <div className="flex flex-col border rounded-md p-5 w-[50%]">
          <span className="text-lg font-semibold text-blue">Thông tin khuyến mãi</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tên khuyến mãi: </span>
            <input
              className="w-[60%] rounded-lg h-9 pl-2 border-[#737373] ml-1"
              placeholder="Tên khuyến mãi"
              value={nameSale}
              onChange={(e) => setNameSale(e.target.value)}
            />
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold w-[30%]">Giảm giá: </span>
            <div className="flex items-center rounded-lg border-[2px] border-[#737373] hover:border-blue ml-9">
              <input
                className="w-[80%] h-9 pl-2 rounded-lg hover:border-none focus:border-none"
                placeholder="Nhập phần trăm"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <span className="font-normal text-base decoration-black">%</span>
            </div>
          </div>
          <div className="flex items-center justify-normal pt-5">
            <span className="text-base text-black font-bold">Ngày bắt đầu: </span>
            <DatePicker
              selected={startDateUD}
              value={startDate}
              onChange={(date) => setStartDateUD(date)}
              timeInputLabel="Time:"
              dateFormat="dd/MM/yyyy h:mm:ss aa"
              showTimeInput
              placeholderText="Nhập ngày bắt đầu"
              className="rounded-lg h-9 pl-2 border-[#737373] w-[100%] ml-4"
            />
          </div>
          <div className="flex items-center justify-normal pt-5">
            <span className="text-base text-black font-bold">Ngày kết thúc: </span>
            <DatePicker
              selected={endDateUD}
              value={endDate}
              onChange={(date) => setEndDateUD(date)}
              timeInputLabel="Time:"
              dateFormat="dd/MM/yyyy h:mm:ss aa"
              showTimeInput
              placeholderText="Nhập ngày kết thúc"
              className="rounded-lg h-9 pl-2 border-[#737373] w-[100%] ml-4"
            />
          </div>
          <div className="flex justify-center mt-5">
            <div className="flex items-center justify-center w-[50%] h-9 bg-blue rounded-md" onClick={handleUpdateSale}>
              <span className="text-white text-base">Cập nhật</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col border rounded-md p-5 ml-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex">
              <span className=" text-lg font-semibold text-blue">Danh sách sản phẩm</span>
              <input
                value={keyword}
                className="border-[2px] rounded-md border-black ml-3 pl-3"
                placeholder="Nhập tên sản phẩm"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <i
                className="bx bx-search text-2xl text-blue ml-3 cursor-pointer"
                onClick={() => {
                  getProdctSale(), setKeyword('');
                }}
              ></i>
            </div>
            <div className="flex items-center">
              <div
                className="w-auto px-2 py-1 cursor-pointer flex justify-center items-center bg-blue rounded-full"
                onClick={() => navigate(path.addProductToSale, { state: id })}
              >
                <i className="bx bxs-plus-circle text-2xl text-white"></i>
              </div>
              {isChoosePro && (
                <i
                  className="bx bxs-trash-alt text-red-500 text-2xl cursor-pointer ml-5"
                  onClick={handleDeleteProductSale}
                ></i>
              )}
            </div>
          </div>
          <div className="w-full h-[1px] bg-black"></div>
          <table className="table w-full">
            <thead>
              <tr>
                <th className="w-[5%]">
                  {isChoose ? (
                    <i className="bx bx-checkbox-checked text-blue text-2xl" onClick={handleSelectAll}></i>
                  ) : (
                    <i className="bx bx-checkbox text-2xl text-black" onClick={handleSelectAll}></i>
                  )}
                </th>
                <th className="w-[10%] text-center text-black">SKU</th>
                <th className="w-[20%] text-center text-black">Tên sản phẩm</th>
                <th className="w-[20%] text-center text-black">Hình ảnh</th>
                <th className="w-[15%] text-center text-black">Giá bán</th>
                <th className="w-[15%] text-center text-black">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {!!productSale &&
                !!productSale.length &&
                productSale.map((item, i) => {
                  return (
                    <tr key={i} className="cursor-pointer">
                      <td>
                        {productId.includes(item?.id) ? (
                          <i
                            className="bx bx-checkbox-checked text-blue text-2xl"
                            onClick={() => handleCheckboxClick(item.id)}
                          ></i>
                        ) : (
                          <i
                            className="bx bx-checkbox text-2xl text-black"
                            onClick={() => handleCheckboxClick(item.id)}
                          ></i>
                        )}
                      </td>
                      <td className="text-center">{item.sku}</td>
                      <td className="text-center">{item.name}</td>
                      <td className="flex justify-center">
                        <img src={`${API_URL_IMAGE}${item?.images[0]?.url}`} className="w-20 h-20 object-contain" />
                      </td>
                      <td className="text-center">{formatPrice(item.price)}</td>
                      {item.status === 1 && <td className="text-green-500 text-center">Hoạt động</td>}
                      {item.status === 0 && <td className="text-red-500 text-center">Đã khóa</td>}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EditSale;
