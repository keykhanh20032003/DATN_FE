import httpRequest from "~/constants/httpRequest";
import { Color, Product } from "~/types/product.type";
import { SuccessResponse } from "~/types/utils.type";

const productApi = {
  getBestSellerProduct : () => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/bestSeller`),
  getProduct : (id) => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/${id}`),
  getProductByName : (name) => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/detail?name=${name}`),
  getAllProduct : () => httpRequest.get<SuccessResponse<Product>, any>(`/api/product`),
  getColor : (id) => httpRequest.get<SuccessResponse<Color>, any>(`/api/color/${id}`),
  getProductByCategory : (id) => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/all/category/${id}`),
  getRelatedProduct : (id) => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/relatedProducts/${id}`),
  getRandomProduct : () => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/randomProducts`),
  getAllProducts : (params) => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/allProduct?${new URLSearchParams(params)}`),
  getAllSize: () => httpRequest.get(`/api/size`),
  getAllColor: () => httpRequest.get(`/api/color`),
  searchProduct : (params) => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/search?${new URLSearchParams(params)}`),
  productSale : () => httpRequest.get<SuccessResponse<Product>, any>(`/api/product/sale`),

}
export default productApi;