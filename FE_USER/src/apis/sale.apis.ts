import httpRequest from "~/constants/httpRequest";
import { Sale } from "~/types/sale.type";
import { SuccessResponse } from "~/types/utils.type";

const saleApi = {
  getSale : (id) => httpRequest.get<SuccessResponse<Sale>, any>(`/api/sale/${id}`),
}
export default saleApi;