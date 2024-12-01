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
import SpinLoading from '~/components/loading/spinLoading';

const AddProductSale = () => {
  const location = useLocation();
  const id = location.state;
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();
  const [productNoSale, setProductNoSale] = React.useState<Product[]>([]);
  const [productId, setProductId] = React.useState<number[]>([]);
  const [isChoose, setIsChoose] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [lastPage, setLastPage] = React.useState(0);
  const [loadding, setLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');

  const getProdctNoSale = async () => {
    if (!!token) {
      try {
        setLoading(true);
        const currentPage = 0;
        setPage(currentPage);
        const url = Api.getProductNoSale(currentPage, keyword);
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
          setProductNoSale(newData);
        } else {
          setLoading(true);
          toast.error(`${res.data.data}`, {
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
    getProdctNoSale();
  }, []);
  const handleCheckboxClick = (id: number) => {
    if (productId.includes(id)) {
      setProductId(productId.filter((item) => item !== id));
    } else {
      setProductId([...productId, id]);
    }
  };
  const handleSelectAll = () => {
    if (!isChoose) {
      const allIds = productNoSale.map((item) => item.id);
      setProductId(allIds);
    } else {
      setProductId([]);
    }
    setIsChoose(!isChoose);
  };
  const isAllSelected = productId.length === productNoSale.length;

  React.useEffect(() => {
    if (productNoSale.length > 0) {
      setIsChoose(isAllSelected);
    }
  }, [productId]);

  const handleAddProductSale = async () => {
    if (!!token) {
      if (!productId) {
        toast.error(`Chọn ít nhất 1 sản phẩm`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      try {
        const url = Api.addProToSale(id, productId);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
          }),
        ]);
        if (res.status) {
          getProdctNoSale();
          toast.success(`Thêm sản phẩm thành công`, {
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
    <div className="flex flex-col border rounded-md p-5 w-full">
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
              getProdctNoSale(), setKeyword('');
            }}
          ></i>
        </div>
        <div className="flex items-center">
          <div
            className="w-auto px-2 py-1 cursor-pointer flex justify-center items-center bg-blue rounded-full"
            onClick={handleAddProductSale}
          >
            <i className="bx bxs-plus-circle text-2xl text-white"></i>
          </div>
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
          {!!productNoSale &&
            !!productNoSale.length &&
            productNoSale.map((item, i) => {
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
                  <td className="flex justify-center text-center">
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
      {loadding && <SpinLoading />}
    </div>
  );
};

export default AddProductSale;
