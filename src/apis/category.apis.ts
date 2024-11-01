import httpRequest from "~/constants/httpRequest";
import { Category } from "~/types/category.type";
import { SuccessResponse } from "~/types/utils.type";

const categoryApi = {
  getCategoryType : (id) => httpRequest.get<SuccessResponse<Category>, any>(`/api/category/type/${id}`),
  getCategory : (id) => httpRequest.get<SuccessResponse<Category>, any>(`/api/category/${id}`),
  getCategoryParent : (id) => httpRequest.get<SuccessResponse<Category>,any>(`/api/category/parent?parentId=${id}`),
}
export default categoryApi;