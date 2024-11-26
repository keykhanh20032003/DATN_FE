import httpRequest from "~/constants/httpRequest";
import { Order } from "~/types/order.type";
import { SuccessResponse } from "~/types/utils.type";

const orderApi = {
  getOrder : (id) => httpRequest.get<SuccessResponse<Order>, any>(`/api/cart/order/user/${id}`),
  cancelOrder : (data) => httpRequest.post<SuccessResponse<Order>, any>(`/api/cart/cancel`, data),
  getOrderDetail: (id) => httpRequest.get(`/api/cart/order/${id}`),

}
export default orderApi;