import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { toast } from 'react-toastify';
import { RootState } from '~/redux/reducers';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL_IMAGE } from '~/constants/utils';
import { Category } from '~/types/category.type';
import { User } from '~/types/user.type';

const DetailArticle = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();

  const location = useLocation();
  const item = location.state;
  const [category, setCategory] = React.useState<Category>();
  const [user, setUser] = React.useState<User>();

  const getCategory = async () => {
    if (!!token) {
      try {
        const url = Api.detailCategory(item.categoryId);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);

        if (res.status) {
          setCategory(res.data);
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
  const getUser = async () => {
    if (!!token) {
      try {
        const url = Api.detailAcc(item.userId);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);

        if (res.status) {
          setUser(res.data);
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
    getCategory();
    getUser();
  }, []);
  return (
    <>
      <div className="flex items-center justify-around mt-0">
        <div className="w-[70%] flex flex-col border rounded-md p-5">
          <span className="text-lg font-semibold text-blue">Thông tin bài viết</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold w-[10%]">Tiêu đề: </span>
            <span className="text-black">{item.title}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tác giả: </span>
            <span className="ml-3 text-black">{item.author}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tài khoản tạo: </span>
            <span className="ml-3 text-black">{user?.username}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày tạo: </span>
            <span className="ml-3 text-black">{item.createdDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Ngày sửa: </span>
            <span className="ml-3 text-black">{item.modifiedDate}</span>
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Trạng thái: </span>
            {item.status === 1 && <span className="text-green-500 ml-3">Hoạt động </span>}
            {item.status === 0 && <span className="text-red-500 ml-3">Đã khóa </span>}
          </div>
          <div className="flex flex-col pt-5">
            <span className="text-base text-black font-bold">Mô tả ngắn: </span>
            <div className="w-full mt-3" dangerouslySetInnerHTML={{ __html: item.shortContent }}></div>
          </div>
          <div className="flex flex-col pt-5">
            <span className="text-base text-black font-bold">Nội dung: </span>
            <div className="w-full mt-3" dangerouslySetInnerHTML={{ __html: item.content }}></div>
          </div>
        </div>
        <div className="w-[25%] flex flex-col self-start">
          <div className="w-full flex flex-col border rounded-md p-5">
            <span className="text-lg font-semibold text-blue">Danh mục</span>
            <div className="w-full h-[1px] bg-black"></div>
            <div className="flex items-center pt-5 text-black">{category?.title}</div>
          </div>
          <div className="w-full flex flex-col border rounded-md p-5 mt-5">
            <span className="text-lg font-semibold text-blue">Hình ảnh</span>
            <div className="w-full h-[1px] bg-black"></div>
            <div className="flex items-center justify-center mt-3">
              <span className="text-sm text-black">Ảnh đại diện</span>
            </div>
            <div className="w-full h-auto border-black border border-dashed rounded-lg mt-2">
              <img src={`${API_URL_IMAGE}${item.image}`} className="w-auto, h-auto object-contain p-3" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around mt-5">
        <div
          className="bg-blue h-10 flex w-[25%] items-center justify-center rounded-lg cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <span className="text-white uppercase">Quay lại</span>
        </div>
      </div>
    </>
  );
};

export default DetailArticle;
