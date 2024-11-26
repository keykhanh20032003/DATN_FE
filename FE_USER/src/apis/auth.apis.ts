import httpRequest from "~/constants/httpRequest";
import { AuthResponse } from "~/types/auth.type";
import { SuccessResponse } from "~/types/utils.type";

const authApi = {
  login : (data) => httpRequest.post<SuccessResponse<string | AuthResponse>, any>("/api/login", data),
  logout : () => httpRequest.post(`/api/logout`),
  forgotPassword : (username : string) => httpRequest.put(`/api/user/forgotPass?username=${username}`),
  getOtp: (data) => httpRequest.put(`/api/generate-otp`, data),
  register: (data) => httpRequest.post(`/api/register`, data),

}
export default authApi;