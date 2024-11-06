import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { RootState } from '~/redux/reducers';
import { Category } from '~/types/category.type';
import { toast } from 'react-toastify';
import path from '~/constants/path';
import Images from '~/assets';

const AddCategory = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const navigate = useNavigate();
  const type = [
    {
      id: 0,
      name: 'Sản phẩm',
    },
    {
      id: 1,
      name: 'Chính sách',
    },
    {
      id: 2,
      name: 'Bài viết',
    },
    {
      id: 3,
      name: 'Tuyển dụng',
    },
  ];

  const [title, setTitle] = React.useState('');
  const [typeId, setTypeId] = React.useState<number>();
  const [description, setDescription] = React.useState('');
  const [parentId, setParentId] = React.useState<number>();
  const [parentCategory, setParentCategory] = React.useState<Category[]>([]);
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
  const getParentCategory = async () => {
    if (!!token) {
      try {
        const url = Api.getParentCategory();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setParentCategory(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
    }
  };
  const createCategory = async () => {
    if (!!token) {
      try {
        if (!title) {
          toast.success(`Tên danh mục không được để trống`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        if (!typeId) {
          toast.success(`Vui lòng chọn 1 loại danh mục`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
          return;
        }
        const data = {
          title: title,
          description: description,
          type: typeId,
          urlImage: fileImg?.name,
          parentCategoryId: parentId,
        };
        const url = Api.createCategory();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);
        if (res.status) {
          navigate(path.categories);
          toast.success(`Danh mục đã được tạo`, {
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
        toast.error(`Có lỗi xảy ra`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        console.error(error);
      }
    }
  };
  React.useEffect(() => {
    getParentCategory();
  }, []);

  const handleChooseType = (e) => {
    const typeId = e.target.value;
    if (typeId !== '-- Chọn loại danh mục --') {
      setTypeId(typeId);
    }
  };
  const handleChooseParent = (e) => {
    const parentId = e.target.value;
    if (parentId !== '-- Chọn danh mục cha --' || parentId !== 'Đây là danh mục cha') {
      setParentId(parentId);
    }
  };
  return (
    <div className="max-w-5xl mx-auto shadow-md border rounded-lg">
      <div className="flex items-center justify-center pt-3">
        <span className="font-bold text-xl uppercase">Thêm mới danh mục</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Tên danh mục</div>
          <div className="w-[70%] flex items-center">
            <input
              className="w-[80%] rounded-lg h-9 pl-2 border-[#737373]"
              placeholder="Tên danh mục"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Loại danh mục</div>
          <div className="w-[70%] flex items-center">
            <select
              name=""
              id=""
              className="h-9 border-[#737373] text-black border-[2px] rounded-lg appearance-none text-center w-[80%]"
              onChange={handleChooseType}
            >
              <option value="">-- Chọn loại danh mục --</option>
              {type.map((item, i) => (
                <option value={item.id} key={i}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Mô tả</div>
          <div className="w-[70%] flex items-center">
            <input
              className="w-[80%] rounded-lg h-9 pl-2 border-[#737373]"
              placeholder="Mô tả danh mục"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-around mt-3">
          <div className="w-[30%] text-center text-black font-bold">Danh mục cha</div>
          <div className="w-[70%] flex items-center">
            <select
              name=""
              id=""
              className="h-9 border-[#737373] text-black border-[2px] rounded-lg appearance-none text-center w-[80%]"
              onChange={handleChooseParent}
            >
              <option value={0}>-- Chọn danh mục cha --</option>
              <option value={0}>Đây là danh mục cha</option>
              {parentCategory.map((item, i) => (
                <option value={item.id} key={i}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
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
            onClick={() => createCategory()}
          >
            <span className="text-black font-bold">Tạo mới</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
