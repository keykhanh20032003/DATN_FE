import httpRequest from "~/constants/httpRequest";
import { Address } from "~/types/address.type";
import { User } from "~/types/user.type";
import { SuccessResponse } from "~/types/utils.type";

const userApi = {
  getAddress : (id) => httpRequest.get<SuccessResponse<Address>, any>(`/api/user/address/${id}`),
  createAddress : (data) => httpRequest.post<SuccessResponse<Address>, any>(`/api/user/address/create`, data),
  deleteAddress : (id) => httpRequest.delete<SuccessResponse<Address>, any>(`/api/user/address/delete/${id}`),
  updateAddress : (id, data) => httpRequest.put<SuccessResponse<Address>, any>(`/api/user/address/update/${id}`, data),
  getUser : (id) => httpRequest.get<SuccessResponse<User>, any>(`/api/user/${id}`),

}
export default userApi;
