import React from 'react';
import { useSelector } from 'react-redux';
import Api from '~/api/apis';
import { REQUEST_API } from '~/constants/method';
import { toast } from 'react-toastify';
import { RootState } from '~/redux/reducers';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Images from '~/assets';
import { Category } from '~/types/category.type';
import { useNavigate } from 'react-router-dom';
import Editor from '~/components/quill';

const AddProduct = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const navigate = useNavigate();
  const [productName, setProductName] = React.useState('');
  // const [sku, setSku] = React.useState('');
  const [material, setMaterial] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<Category[]>([]);
  const [categoryId, setCategoryId] = React.useState();
  const [color, setColor] = React.useState('');
  const [size, setSize] = React.useState('');
  const [quantity, setQuantity] = React.useState<number>(1);
  const [addVariants, setAddVariants] = React.useState([{ color: '', sizes: [{ size: '', quantity: '' }] }]);
  const [newColor, setNewColor] = React.useState({
    color: '',
    sizes: [
      {
        size: '',
        quantity: '',
      },
    ],
  });
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>, colorIndex) => {
    const newColor = event.target.value;
    setColor(newColor);
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[colorIndex].color = newColor;
      return newVariants;
    });
  };
  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>, colorIndex, sizeIndex) => {
    const newSize = event.target.value;
    setSize(newSize);
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[colorIndex].sizes[sizeIndex].size = newSize;
      return newVariants;
    });
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, colorIndex, sizeIndex) => {
    const newQuantity = event.target.value;
    setQuantity(Number(newQuantity));
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[colorIndex].sizes[sizeIndex].quantity = newQuantity;
      return newVariants;
    });
  };
  const handleAddSize = (colorIndex) => {
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[colorIndex].sizes.push({ size: '', quantity: '' });
      return newVariants;
    });
  };
  const handleRemoveSize = (colorIndex, sizeIndex) => {
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[colorIndex].sizes.splice(sizeIndex, 1);
      return newVariants;
    });
  };
  const handleAddColor = () => {
    setAddVariants((prevVariants) => [
      ...prevVariants,
      {
        color: newColor.color,
        sizes: [
          {
            size: '',
            quantity: '',
          },
        ],
      },
    ]);
    setNewColor({
      color: '',
      sizes: [
        {
          size: '',
          quantity: '',
        },
      ],
    });
  };
  const handleRemoveColor = (colorIndex) => {
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants.splice(colorIndex, 1);
      return newVariants;
    });
  };
  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);

  // const img = React.useMemo(() => {
  //   return fileImg ? URL.createObjectURL(fileImg) : '';
  // }, [fileImg]);
  const refInputImage = React.useRef<HTMLInputElement>(null);
  const handleUpload = () => {
    refInputImage.current?.click();
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = event.target.files;
    if (filesFromLocal) {
      const newSelectedImages = [...selectedImages];
      for (let i = 0; i < filesFromLocal.length; i++) {
        newSelectedImages.push(filesFromLocal[i]);
      }
      setSelectedImages(newSelectedImages);
    }
  };
  const handleRemoveImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);
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
  React.useEffect(() => {
    getAllCategory();
  }, []);
  const colorsData = addVariants.map((item) => ({
    value: item.color,
    sizes: item.sizes.map((sizeItem) => ({
      value: sizeItem.size,
      total: parseInt(sizeItem.quantity, 10),
    })),
  }));
  const imagesData = selectedImages.map((item) => ({
    url: item.name,
  }));

  const handleCreateProduct = async () => {
    if (!!token) {
      if (!productName) {
        toast.error(`Vui lòng nhập tên sản phẩm`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!description) {
        toast.error(`Vui lòng mô tả sản phẩm`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!material) {
        toast.error(`Vui lòng nhập chất liệu sản phẩm`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!price) {
        toast.error(`Vui lòng nhập giá sản phẩm`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (selectedImages.length < 4) {
        toast.error(`Vui lòng chọn 4 ảnh cho sản phẩm`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!categoryId) {
        toast.error(`Vui lòng chọn 1 danh mục`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!color) {
        toast.error(`Vui lòng nhập màu sắc`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!size) {
        toast.error(`Vui lòng nhập size`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!quantity) {
        toast.error(`Vui lòng nhập số lượng`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (isNaN(Number(quantity))) {
        toast.error(`Số lượng không hợp lệ`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (isNaN(Number(price))) {
        toast.error(`Giá không hợp lệ`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      const data = {
        name: productName,
        description: description,
        material: material,
        price: price,
        categoryId: categoryId,
        userId: user.id,
        colors: colorsData,
        images: imagesData,
      };
      try {
        const url = Api.createProduct();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'post',
            token: token,
            data: data,
          }),
        ]);
        if (res.status) {
          navigate(-1);
          toast.success(`Tạo mới sản phẩm thành công`, {
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
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory !== '--Chọn danh mục--') {
      setCategoryId(selectedCategory);
    }
  };

  return (
    <>
      <div className="flex items-center justify-around mt-0">
        <div className="w-[70%] flex flex-col border rounded-md p-5">
          <span className="text-lg font-semibold text-blue">Thông tin sản phẩm</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tên sản phẩm: </span>
            <input
              className="h-9 ml-5 pl-2 border-black border-[1px] rounded-lg w-[70%]"
              placeholder="Nhập tên sản phẩm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Chất liệu: </span>
            <input
              className="h-9 ml-5 pl-2 border-black border-[1px] rounded-lg w-[70%]"
              placeholder="Nhập chất liệu"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            />
          </div>
          <div className="flex flex-col pt-5">
            <span className="text-base text-black font-bold">Mô tả: </span>
            {/* <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="w-full"
              placeholder="Nhập mô tả ở đây"
            /> */}
            <Editor value={description} onChange={setDescription} placeholder={'Viết mô tả ở đây'} />
          </div>
        </div>
        <div className="w-[25%] flex flex-col border rounded-md p-5 self-start">
          <span className="text-lg font-semibold text-blue">Giá</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Giá: </span>
            <input
              className="h-9 ml-5 pl-2 border-black border-[1px] rounded-lg w-[70%]"
              placeholder="Nhập giá"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around mt-5">
        <div className="w-[70%] flex flex-col border rounded-md p-5">
          <span className="text-lg font-semibold text-blue">Hình ảnh</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="w-full h-auto border-black border border-dashed rounded-lg mt-5 p-3">
            <input
              className="hidden"
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              ref={refInputImage}
              onChange={onFileChange}
            />
            <div className="grid grid-cols-4 gap-4 items-center justify-around cursor-pointer">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(image)} className="w-40 h-40 object-contain" />
                  <div
                    onClick={() => handleRemoveImage(index)}
                    className="absolute w-[20px] h-[20px] rounded items-center justify-center flex bg-[#00000080] top-[0%] right-[0%]"
                  >
                    <img src={Images.iconX} className="w-[10px] h-[10px]" />
                  </div>
                </div>
              ))}
              <div onClick={handleUpload} className="flex flex-col items-center justify-center">
                <img src={Images.chooseImage} className="w-[120px] h-[120px] object-contain" />
                <span>Chọn ảnh để tải lên</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-5">
            <span className="text-sm text-black">Hình ảnh đầu tiên và thứ 2 được làm ảnh đại diện</span>
          </div>
        </div>
        <div className="w-[25%] flex flex-col border rounded-md p-5 self-start">
          <span className="text-lg font-semibold text-blue">Danh mục</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <div className="w-full">
              <select
                name=""
                id=""
                className="h-9 border-black border-[1px] rounded-lg appearance-none px-5"
                onChange={handleCategoryChange}
              >
                <option value="">--Chọn danh mục--</option>
                {!!category &&
                  !!category.length &&
                  category.map((item, i) => (
                    <option value={item.id} key={i}>
                      {item.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around mt-5">
        <div className="w-[70%] flex flex-col border rounded-md p-5">
          <span className="text-lg font-semibold text-blue">Chi tiết</span>
          <div className="w-full h-[1px] bg-black"></div>
          {addVariants.map((color, colorIndex) => (
            <div className="flex mt-3" key={colorIndex}>
              <div className="">
                <label htmlFor={`color-${colorIndex}`} className="block font-medium mb-1 cursor-pointer">
                  Màu sắc:
                </label>
                <input
                  type="text"
                  id={`color-${colorIndex}`}
                  value={color.color}
                  onChange={(e) => handleColorChange(e, colorIndex)}
                  className="p-2 border border-black rounded-md w-40"
                />
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <label className="block font-medium mb-1 cursor-pointer w-40">Kích thước:</label>
                  <label className="block font-medium mb-1 cursor-pointer w-40 ml-3">Số lượng:</label>
                </div>
                {color.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex}>
                    <input
                      type="text"
                      value={size.size}
                      onChange={(e) => handleSizeChange(e, colorIndex, sizeIndex)}
                      className="p-2 border border-black rounded-md w-40"
                    />
                    <input
                      type="text"
                      value={size.quantity}
                      onChange={(e) => handleQuantityChange(e, colorIndex, sizeIndex)}
                      className="p-2 border border-black rounded-md w-40 ml-3"
                    />
                    <button
                      className="bg-red-500 text-white px-4 rounded-md ml-3"
                      onClick={() => handleRemoveSize(colorIndex, sizeIndex)}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  className="bg-blue cursor-pointer text-white px-4 mt-2 rounded-md"
                  onClick={() => handleAddSize(colorIndex)}
                >
                  Thêm kích thước
                </button>
              </div>
              <div className="ml-4">
                <button
                  className="bg-red-500 cursor-pointer text-white px-4 rounded-md"
                  onClick={() => handleRemoveColor(colorIndex)}
                >
                  Xóa Màu sắc
                </button>
              </div>
            </div>
          ))}
          <div className="mt-3">
            <button className="bg-blue cursor-pointer text-white px-4 rounded-md" onClick={handleAddColor}>
              Thêm Màu sắc
            </button>
          </div>

          <div className=""></div>
        </div>
        <div className="w-[25%] self-end">
          <div
            className="bg-blue w-full h-10 flex items-center justify-center rounded-lg cursor-pointer"
            onClick={() => handleCreateProduct()}
          >
            <span className="text-white uppercase">Thêm sản phẩm</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
