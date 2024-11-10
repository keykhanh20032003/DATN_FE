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
import Editor from '~/components/quill';
import { Article } from '~/types/article.type';
import { API_URL_IMAGE } from '~/constants/utils';

const EditArticle = () => {
  const token = useSelector((state: RootState) => state.ReducerAuth.token);
  const user = useSelector((state: RootState) => state.ReducerAuth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;
  const [article, setArticle] = React.useState<Article>();
  const [articleName, setArticleName] = React.useState('');
  const [shortContent, setShortContent] = React.useState('');
  const [content, setContent] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [category, setCategory] = React.useState<Category[]>([]);
  const [categoryId, setCategoryId] = React.useState<number>();
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
  React.useEffect(() => {
    if (article != null) {
      setArticleName(article.title);
      setAuthor(article.author);
      setCategoryId(article.categoryId || null || undefined);
      setShortContent(article.shortContent);
      setContent(article.content);
      setFileImg(new File([], article.image));
    }
  }, [article]);
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
          setCategory(res.data.data);
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
  const getArticle = async () => {
    if (!!token) {
      try {
        const url = Api.detailArticle(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'get',
            token: token,
          }),
        ]);
        if (res.status) {
          setArticle(res.data);
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
    getArticle();
  }, []);

  const handleUpdateArticle = async () => {
    if (!!token) {
      if (!articleName) {
        toast.error(`Vui lòng nhập tiêu đề`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!author) {
        toast.error(`Vui lòng nhập tác giả`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!shortContent) {
        toast.error(`Vui lòng nhập mô tả ngắm`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!content) {
        toast.error(`Vui lòng nhập mô tả`, {
          position: 'top-right',
          pauseOnHover: false,
          theme: 'dark',
        });
        return;
      }
      if (!img) {
        toast.error(`Chọn ảnh cho bài viết`, {
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
      const data = {
        title: articleName,
        author: author,
        shortContent: shortContent,
        content: content,
        categoryId: categoryId,
        userId: user.id,
        image: fileImg?.name,
      };
      try {
        const url = Api.updateArticle(id);
        const [res] = await Promise.all([
          REQUEST_API({
            url: url,
            method: 'put',
            token: token,
            data: data,
          }),
        ]);
        if (res.status) {
          // navigate(-1);
          toast.success(`Cập nhật bài viết thành công`, {
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
          <span className="text-lg font-semibold text-blue">Thông tin bài viết</span>
          <div className="w-full h-[1px] bg-black"></div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tiêu đề: </span>
            <input
              className="h-9 ml-5 pl-2 border-black border-[1px] rounded-lg w-[70%]"
              placeholder="Nhập tiêu đề"
              value={articleName}
              onChange={(e) => setArticleName(e.target.value)}
            />
          </div>
          <div className="flex items-center pt-5">
            <span className="text-base text-black font-bold">Tác giả: </span>
            <input
              className="h-9 ml-5 pl-2 border-black border-[1px] rounded-lg w-[70%]"
              placeholder="Nhập tác giả"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="flex flex-col pt-5">
            <span className="text-base text-black font-bold">Mô tả ngắn: </span>
            <ReactQuill
              theme="snow"
              value={shortContent}
              onChange={setShortContent}
              className="w-full mt-3"
              placeholder="Nhập mô tả ở đây"
            />
            {/* <Editor placeholder={'Viết Mô tả ở đây'}/> */}
          </div>
          <div className="flex flex-col pt-5">
            <span className="text-base text-black font-bold">Nội dung: </span>
            {/* <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              className="w-full"
              placeholder="Nhập nội dung"
            /> */}
            <Editor value={content} onChange={setContent} placeholder={'Viết nội dung ở đây'} />
          </div>
        </div>
        <div className="w-[25%] flex flex-col self-start">
          <div className="w-full flex flex-col border rounded-md p-5">
            <span className="text-lg font-semibold text-blue">Danh mục</span>
            <div className="w-full h-[1px] bg-black"></div>
            <div className="flex items-center pt-5">
              <div className="w-full">
                <select
                  name=""
                  id=""
                  className="h-9 border-black border-[1px] rounded-lg appearance-none px-5"
                  onChange={handleCategoryChange}
                  value={categoryId}
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
          <div className="w-full flex flex-col border rounded-md p-5 mt-5">
            <span className="text-lg font-semibold text-blue">Hình ảnh</span>
            <div className="w-full h-[1px] bg-black"></div>
            <div className="w-full h-auto border-black border border-dashed rounded-lg mt-5">
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
                    <img src={`${API_URL_IMAGE}${fileImg?.name}`} className="w-auto h-auto object-contain p-3" />
                    <div
                      onClick={() => setFileImg('')}
                      className="absolute w-[20px] h-[20px] rounded items-center justify-center flex bg-[#00000080] top-[6%] right-[6%]"
                    >
                      <img src={Images.iconX} className="w-[10px] h-[10px]" />
                    </div>
                  </div>
                ) : (
                  <div onClick={handleUpload} className="flex flex-col items-center justify-center">
                    <img src={Images.chooseImage} className="w-[120px] h-[120px] object-contain ml-5" />
                    <span>Chọn ảnh để tải lên</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-5">
              <span className="text-sm text-black">Ảnh được làm ảnh đại diện</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-around mt-5">
        <div
          className="bg-blue h-10 flex w-[25%] items-center justify-center rounded-lg cursor-pointer"
          onClick={() => handleUpdateArticle()}
        >
          <span className="text-white uppercase">Cập nhật</span>
        </div>
      </div>
    </>
  );
};

export default EditArticle;
