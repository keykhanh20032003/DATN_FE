import httpRequest from "~/constants/httpRequest";
import { Banner } from "~/types/category.type";
import { SuccessResponse } from "~/types/utils.type";

const homeApi = {
  getSlideHome : () => httpRequest.get<SuccessResponse<Banner>, any>(`/api/banner`),
}
export default homeApi;