export interface Products {
  currentPage: number;
  data: Product;
  perPage: number;
  total: number;
}

export interface ProductImages {
  id: number;
  url: string | null;
}
export interface Size {
  id: number;
  value: string;
  total: number;
  sold: number;
}
export interface Color {
  id: number;
  value: string;
  sizes: Size;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  material: string;
  visited: number;
  price: number;
  salePrice: number;
  modifiedDate: string;
  createdDate: string;
  status: number;
  author: number;
  category: number | null;
  sale: number | null;
  colors: Color;
  images: ProductImages[];
}
// const bb = {
//   "id": 1,
//                 "name": "test sản phẩm sale",
//                 "description": "Đầm sát nách, dáng thắt eo, phom đầm suông dập ly tăm, chi tiết hoa cắt laser đính 3D nổi phần ngực, cài cúc sau.",
//                 "sku": "OB1YJe0",
//                 "material": "Tơ",
//                 "visited": 3,
//                 "price": 1500000,
//                 "salePrice": 1050000,
//                 "modifiedDate": "18:52:19 08-08-2023",
//                 "createdDate": "18:52:19 08-08-2023",
//                 "status": 1,
//                 "author": 1,
//                 "category": 1,
//                 "sale": 1,
// }