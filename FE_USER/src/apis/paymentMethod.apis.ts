import { API_URL } from "~/constants/utils";

const paymentMethodApi = {
  createVNPay : (id) => API_URL + `/api/vnpay/create?orderId=${id}`,
  createZaloPay : (id) => API_URL + `/api/zalopay/create-order?orderId=${id}`,
  getZaloStatus: (id) => API_URL + `/api/zalopay/getstatusbyapptransid?apptransid=${id}`,
  getResultVnPay: () => API_URL + `/api/vnpay/result`,
}
export default paymentMethodApi;