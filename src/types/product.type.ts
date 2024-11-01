export interface Products {
  currentPage: number;
  data: Product;
  perPage: number;
  total: number;
}

export interface ProductImages {
  id: number;
  url: string;
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
  sizes: Size[];
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
  category: number;
  sale: number;
  colors: Color[];
  images: ProductImages[];
}