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
import { useLocation, useNavigate } from 'react-router-dom';
import { Product, ProductImages } from '~/types/product.type';
import { API_URL_IMAGE, formatPrice } from '~/constants/utils';

const EditProduct = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state;
  const [product, setProduct] = React.useState<Product>();
  const [productName, setProductName] = React.useState('');
  const [material, setMaterial] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<Category[]>([]);
  const [oldImages, setOldImages] = React.useState<ProductImages[]>([]);
  const [categoryId, setCategoryId] = React.useState();
  const [addVariants, setAddVariants] = React.useState([
    { id: '', color: '', sizes: [{ id: '', size: '', quantity: '' }] },
  ]);
  const [color, setColor] = React.useState('');
  const [size, setSize] = React.useState('');
  const [colorId, setColorId] = React.useState();
  const [sizeId, setSizeId] = React.useState();
  const [quantity, setQuantity] = React.useState<number>(1);
  React.useEffect(() => {
    setProductName(product?.name || '');
    setMaterial(product?.material || '');
    setPrice(product?.price || '');
    setDescription(product?.description || '');
    setCategoryId(product?.category || '');
    // Kiểm tra xem có dữ liệu hình ảnh đã chọn từ product hay không
    if (product?.images && product.images.length > 0) {
      setOldImages(product?.images);
    } else {
      setOldImages([]); // Nếu không có, đặt oldImages là một mảng rỗng
    }
    const newAddVariants = [];
    if (product?.colors) {
      // Lặp qua từng màu
      for (const color of Object.values(product.colors)) {
        setColorId(color.id);
        setColor(color.value);
        const sizes = [];
        if (color.sizes) {
          // Lặp qua từng kích thước của màu đó
          for (const size of Object.values(color.sizes)) {
            setSizeId(size.id);
            setSize(size.value);
            setQuantity(size.total);
            // Tạo biến thể từ thông tin màu, kích thước và số lượng
            sizes.push({ id: size.id, size: size.value, quantity: size.total });
          }
        }
        const variant = {
          id: color.id,
          color: color.value,
          sizes: sizes,
        };
        newAddVariants.push(variant);
      }
    }
    setAddVariants(newAddVariants);
  }, [product]);
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
    if (addVariants.length > 0 && addVariants[addVariants.length - 1].color === '') {
      return;
    }
    setAddVariants((prevVariants) => [...prevVariants, { color: '', sizes: [{ size: '', quantity: '' }] }]);
  };
  const handleRemoveColor = (colorIndex) => {
    setAddVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants.splice(colorIndex, 1);
      return newVariants;
    });
  };
  const [newImages, setNewImages] = React.useState<File[]>([]);
  const refInputImage = React.useRef<HTMLInputElement>(null);
  const handleUpload = () => {
    refInputImage.current?.click();
  };
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = event.target.files;
    if (filesFromLocal) {
      const newSelectedImages = [...newImages];
      for (let i = 0; i < filesFromLocal.length; i++) {
        if (newSelectedImages.length < 4) {
          newSelectedImages.push(filesFromLocal[i]);
        } else {
          break;
        }
      }
      setNewImages(newSelectedImages);
    }
  };
  const handleRemoveImage = (index: number) => {
    const newImagesToRemove = [...newImages];
    newImagesToRemove.splice(index, 1);
    setNewImages(newImagesToRemove);
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
  const handleDeleteImage = async (id: number) => {
    if (!!token) {
      try {
        const url = Api.deleteProImages(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'delete',
            token: token,
          }),
        ]);
        if (res.status) {
          const imageId = oldImages.findIndex((image) => image.id === id);
          if (imageId !== -1) {
            const updatedImages = [...oldImages];
            updatedImages.splice(imageId, 1);
            setOldImages(updatedImages);
          }
        } else {
          toast.error(`Có lỗi xảy ra`, {
            position: 'top-right',
            pauseOnHover: false,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const colorsData = addVariants.map((item) => ({
    id: item.id,
    value: item.color,
    sizes: item.sizes.map((sizeItem) => ({
      id: sizeItem.id,
      value: sizeItem.size,
      total: parseInt(sizeItem.quantity, 10),
    })),
  }));

  const imagesData = newImages.map((item, i) => ({
    url: item.name,
  }));

  const handleUpdateProduct = async () => {
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
      if (oldImages.length < 4) {
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
        id: productId,
        name: productName,
        description: description,
        material: material,
        price: price,
        categoryId: Number(categoryId),
        userId: user.id,
        colors: colorsData,
        images: imagesData,
      };
      try {
        const url = Api.updateProduct();
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
            data: data,
          }),
        ]);
        if (res.status) {
          getProduct();
          setNewImages([]);
          toast.success(`Cập nhật sản phẩm thành công`, {
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
    } else {
      toast.error(`Vui lòng đăng nhập lại`, {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  const getProduct = async () => {
    if (!!token) {
      try {
        const url = Api.detailProduct(productId);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setProduct(res.data);
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
    } else {
      toast.error(`Vui lòng đăng nhập lại`, {
        position: 'top-right',
        pauseOnHover: false,
        theme: 'dark',
      });
    }
  };
  React.useEffect(() => {
    getProduct();
  }, []);
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory !== '--Chọn danh mục--') {
      setCategoryId(selectedCategory);
    }
  };

  return (
    <>
      {/* Phần 1 */}
      <div className="flex items-center justify-around mt-0">
        {/* Bên phải */}
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
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="w-full"
              placeholder="Nhập mô tả ở đây"
            />
            {/* <Editor placeholder={'Viết Mô tả ở đây'}/> */}
          </div>
        </div>
        {/* Bên trái */}
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
      {/* Phần 2 */}
      <div className="flex items-center justify-around mt-5">
        {/* Bên phải */}
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
              {oldImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={`${API_URL_IMAGE}${image?.url}`} className="w-40 h-40 object-contain" />
                  <div
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute w-[20px] h-[20px] rounded items-center justify-center flex bg-[#00000080] top-[0%] right-[0]"
                  >
                    <img src={Images.iconX} className="w-[10px] h-[10px]" />
                  </div>
                </div>
              ))}
              {newImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(image)} className="w-40 h-40 object-contain" />
                  <div
                    onClick={() => handleRemoveImage(index)}
                    className="absolute w-[20px] h-[20px] rounded items-center justify-center flex bg-[#00000080] top-[0%] right-[0]"
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
        {/* Bên trái */}
        <div className="w-[25%] flex flex-col border rounded-md p-5 self-start">
          <span className="text-lg font-semibold text-blue">Danh mục</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <div className="w-full">
              <select
                name=""
                id=""
                className="h-9 border-black text-black border-[1px] rounded-lg appearance-none text-center w-[80%]"
                onChange={handleCategoryChange}
                value={categoryId}
              >
                <option value="">--Chọn danh mục--</option>
                {!!category &&
                  !!category.length &&
                  category.map((item, i) => (
                    <option value={item.id} key={i} className="text-black">
                      {item.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Phần 3 */}
      <div className="flex items-center justify-around mt-5">
        {/* Bên phải */}
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
                  <label className="block font-medium cursor-pointer w-40">Kích thước:</label>
                  <label className="block font-medium cursor-pointer w-40 ml-3">Số lượng:</label>
                </div>
                {color.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="mt-1">
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
        {/* Bên trái */}
        <div className="w-[25%] self-end flex justify-around">
          <div
            className="bg-red-500 h-10 flex items-center justify-center rounded-lg cursor-pointer w-[40%]"
            onClick={() => navigate(-1)}
          >
            <span className="text-white">Hủy</span>
          </div>
          <div
            className="bg-blue h-10 flex items-center justify-center rounded-lg cursor-pointer w-[40%]"
            onClick={() => handleUpdateProduct()}
          >
            <span className="text-white">Lưu</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
