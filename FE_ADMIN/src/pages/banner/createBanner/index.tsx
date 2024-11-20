import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Api from '~/api/apis';
import Images from '~/assets';
import { REQUEST_API } from '~/constants/method';
import path from '~/constants/path';
import { RootState } from '~/redux/reducers';
import { Category } from '~/types/category.type';

const CreateBanner = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);

  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [categoryId, setCategoryId] = React.useState<number>();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [fileImg, setFileImg] = React.useState<File>();
  const img = React.useMemo(() => {
    return fileImg ? URL.createObjectURL(fileImg) : '';
  }, [fileImg]);
  const refInputImage = React.useRef<HTMLInputElement>(null);
  const handleUpload = () => {
    refInputImage.current?.click();
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];
    // pushDa(fileFromLocal);
    setFileImg(fileFromLocal);
    // console.log(fileFromLocal);
  };

  const createBanner = async () => {
    if (!!token) {
      try {
        if (!name) {
          toast.error(`Tên banner không được để trống`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        if (!img) {
          toast.error(`Vui lòng chọn 1 ảnh để làm banner`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        const data = {
          name: name,
          categoryId: categoryId,
          src: fileImg?.name,
        };
        const url = Api.createBanner();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);
        if (res.status) {
          navigate(path.banners);
          toast.success(`Banners đã được tạo`, {
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
  const getAllCategory = async () => {
    if (!!token) {
      try {
        const url = Api.getAllCategory2();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);

        if (res.status) {
          setCategories(res.data);
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
    getAllCategory();
  }, []);

  const handleChooseCategory = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory !== '-- Chọn danh mục --') {
      setCategoryId(selectedCategory);
    }
  };
  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thêm mới banner</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Tên banner</div>
          <div className="w-[70%] flex items-center">
            <input
              className="w-[80%] rounded-lg h-9 pl-2 border-[#737373]"
              placeholder="Tên banner"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Danh mục</div>
          <div className="w-[70%] flex items-center">
            <select
              name=""
              id=""
              className="h-9 border-[#737373] text-black border-[2px] rounded-lg appearance-none text-center w-[80%]"
              onChange={handleChooseCategory}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((item, i) => (
                <option value={item.id} key={i}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Hình ảnh</div>
          <div className="w-[70%] flex items-center"></div>
        </div>
        <div className="flex mt-3">
          <div className="w-[30%]"></div>
          <div className="w-[50%] h-auto p-3 border-black border border-dashed rounded-lg">
            <input
              className="hidden"
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              ref={refInputImage}
              onChange={onFileChange}
            />
            <div className="flex items-center justify-around cursor-pointer">
              {img ? (
                <div className="relative">
                  <img src={img} className="w-auto h-auto object-contain" />
                  <div
                    onClick={() => setFileImg('')}
                    className="absolute w-[20px] h-[20px] rounded items-center justify-center flex bg-[#00000080] top-0 right-0"
                  >
                    <img src={Images.iconX} className="w-[10px] h-[10px]" />
                  </div>
                </div>
              ) : (
                <div onClick={handleUpload} className="flex flex-col items-center justify-center">
                  <img src={Images.chooseImage} className="w-[120px] h-[120px] object-contain pt-2" />
                  <span>Chọn ảnh để tải lên</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-3 ml-[15%]">
          <div
            className="w-[30%] flex justify-center items-center bg-blue rounded-md h-10 cursor-pointer"
            onClick={() => createBanner()}
          >
            <span className="text-black font-bold">Tạo mới</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBanner;
