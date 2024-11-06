import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { Category } from '~/types/category.type';
import { toast } from 'react-toastify';
import path from '~/constants/path';
import { Banner } from '~/types/banner.type';
import { API_URL_IMAGE } from '~/constants/utils';

const DetailCategory = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.item.id;
  const [categrory, setCategory] = React.useState<Category>();
  const parentCategoryId = categrory?.categoryParent;
  const [parentCategory, setParentCategory] = React.useState<Category>();
  const [banners, setBanners] = React.useState<Banner[]>([]);

  const viewDetail = async () => {
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
        console.log(res);
        if (res.status) {
          setCategory(res.data);
          setBanners(res.data.banners);
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
  const getParentCategory = async () => {
    if (!!token) {
      try {
        const url = Api.detailCategory(parentCategoryId);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setParentCategory(res.data);
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
    if (categrory?.categoryParent != null) {
      getParentCategory();
    }
  }, [categrory]);
  React.useEffect(() => {
    viewDetail();
  }, []);
  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thông tin danh mục</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Mã danh mục :</div>
          <div className="w-[70%] relative flex items-center">{categrory?.id}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%]  text-black font-bold">Tên danh mục :</div>
          <div className="w-[70%] relative flex items-center justify-between">{categrory?.title}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%]  text-black font-bold">Mô tả :</div>
          <div className="w-[70%] relative flex items-center">{categrory?.description}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Loại danh mục :</div>
          <div className="w-[70%] relative flex items-center">
            {categrory?.type == 0 && 'Sản phẩm'}
            {categrory?.type == 1 && 'Chính sách'}
            {categrory?.type == 2 && 'Bài viết'}
            {categrory?.type == 3 && 'Tuyển dụng'}
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Danh mục cha :</div>
          <div className="w-[70%] relative flex items-center">{parentCategory?.title}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Banner :</div>
          <div className="w-[70%] relative flex items-center">
            {!!banners &&
              !!banners.length &&
              banners.map((item, i) => (
                <img src={`${API_URL_IMAGE}${item.src}`} className="w-40 h-40 object-contain" key={i} />
              ))}
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Ngày tạo :</div>
          <div className="w-[70%] relative flex items-center">{categrory?.createdDate}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Ngày sửa :</div>
          <div className="w-[70%] relative flex items-center">{categrory?.modifiedDate}</div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-black font-bold">Trạng thái :</div>
          {categrory?.status === 1 && (
            <div className="w-[70%] relative flex items-center text-green-500">Hoạt động :</div>
          )}
          {categrory?.status === 0 && <div className="w-[70%] relative flex items-center text-red-500">Đã khóa</div>}
        </div>
        <div className="flex flex-col mt-3">
          <div className="w-[30%] text-black font-bold">Hình ảnh :</div>
          <img src={`${API_URL_IMAGE}${categrory?.urlImage}`} className="object-contain" />
        </div>
        <div className="flex items-center justify-center mt-3 ml-[70%]">
          <div
            className="w-[30%] flex justify-center items-center bg-blue rounded-md h-10 cursor-pointer"
            onClick={() => navigate(path.categories)}
          >
            <span className='text-black font-bold"'>Quay lại</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCategory;
