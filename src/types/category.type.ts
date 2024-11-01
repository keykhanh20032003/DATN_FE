export interface Category {
  banners: Banner;
  categoryParent: null;
  childCategories: Category[];
  createdDate: string;
  description: string;
  id: number;
  modifiedDate: string;
  status: number;
  title: string;
  type: number;
  urlImage: null;
}
export interface Banner {
  categoryId: number;
  createdDate: string;
  id: number;
  modifiedDate: string;
  name: string;
  src: string;
}

// const bb = {
//   categoryId
// : 
// 1
// createdDate
// : 
// "10:47:31 24-08-2023"
// id
// : 
// 3
// modifiedDate
// : 
// "10:48:54 24-08-2023"
// name
// : 
// "Banner sản phẩm"
// src
// : 
// "slide_home_1.jpg"
// }