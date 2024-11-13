import httpRequest from "~/constants/httpRequest";
import { Order } from "~/types/order.type";
import { SuccessResponse } from "~/types/utils.type";

const cartApi = {
  getCart : (id) => httpRequest.get<SuccessResponse<Order>, any>(`/api/cart/user/${id}`),
  addToCart : (id, data) => httpRequest.post<SuccessResponse<Order>, any>(`/api/cart/addToCart/${id}`, data),
  deleteFromCart: (id) => httpRequest.delete(`/api/cart/deleteItemFormCart?id=${id}`),
  delete1Item: (id) => httpRequest.delete(`/api/cart/delete1Item?id=${id}`),
  plusItem: (id) => httpRequest.post(`/api/cart/plusItem?id=${id}`),
  checkOrder: (id) => httpRequest.post(`/api/cart/checkOrder/${id}`),
  orderCart: (id, data) => httpRequest.post(`/api/cart/create/${id}`, data),
  getDetailOrder: (id) => httpRequest.get<SuccessResponse<Order>, any>(`/api/cart/order/${id}`),
}
export default cartApi;