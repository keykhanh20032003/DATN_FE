import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { toast } from 'react-toastify';
import { Sale } from '~/types/sale.type';
import { Product } from '~/types/product.type';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';

const DetailSale = () => {
  const location = useLocation();
  const item = location.state.item;
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const [sale, setSale] = React.useState<Sale>();
  const [productSale, setProductSale] = React.useState<Product[]>([]);
  const [keyword, setKeyword] = React.useState('');

  const getProductSale = async () => {
    if (!!token) {
      try {
        const url = Api.getProductSale(item.id, keyword);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setProductSale(res.data);
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
  React.useEffect(() => {
    getProductSale();
  }, []);
  React.useEffect(() => {
    if (item != null) {
      setSale(item);
    }
  }, [item]);

  return (
    <>
      <div className="flex mt-0">
        <div className="flex flex-col border rounded-md p-5 w-[50%]">
          <span className="text-lg font-semibold text-blue">Thông tin khuyến mãi</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tên khuyến mãi: </span>
            <span className="text-base ml-5">{sale?.name}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Giảm giá: </span>
            <span className="text-base ml-5">{sale?.discount} %</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày bắt đầu: </span>
            <span className="text-base ml-5">{sale?.startDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày kết thúc: </span>
            <span className="text-base ml-5">{sale?.endDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày tạo: </span>
            <span className="text-base ml-5">{sale?.createdDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày sửa: </span>
            <span className="text-base ml-5">{sale?.modifiedDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Trạng thái: </span>
            {sale?.isActive === 1 && <span className="text-base ml-5 text-green-500">Hoạt động</span>}
            {sale?.isActive === 0 && <span className="text-base ml-5 text-red-500">Đã khóa</span>}
          </div>
        </div>
        <div className="flex flex-col border rounded-md p-5 ml-10 w-full">
          <div className="flex mb-3">
            <span className="text-lg font-semibold text-blue">Danh sách sản phẩm</span>
            <input
              value={keyword}
              className="border-[2px] rounded-md border-black ml-3 pl-3"
              placeholder="Nhập tên sản phẩm"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <i
              className="bx bx-search text-2xl text-blue ml-3 cursor-pointer"
              onClick={() => {
                getProductSale(), setKeyword('');
              }}
            ></i>
          </div>
          <div className="w-full h-[1px] bg-black"></div>
          <table className="table w-full">
            <thead>
              <tr>
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
        </div>
      </div>
    </>
  );
};

export default DetailSale;
