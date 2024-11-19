import { Color, ColorCreate } from "./product.type";

export interface Order {
  addressDetail: string;
  codeOrders: string;
  createDate: string;
  district: string;
  fullName: string;
  id: number;
  isCheckout: boolean;
  items: OrderItem;
  modifiedDate: string;
  note: null | string;
  paymentMethod: string;
  phone: string;
  province: string;
  orderDate: string;
  shipDate: null | string;
  shippingFee: number;
  status: number;
  type: number;
  user: number;
  userNameEmp: null | string;
  wards: string;
}
export interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  sellPrice: number;
  valueColor: string;
  valueSize: string;
}

export interface OrderCreate {
  code: string;
  paymentMethod: string;
  fullName: string;
  phone: string;
  addressDetail: string;
  province: string;
  district: string;
  wards: string,
  note: string,
  items: OrderItem[]
}

export interface OrderItemCreate {
  id: number;
  productName: string;
  quantity: number;
  sellPrice: number;
  valueColor: string;
  valueSize: string;
  color: ColorCreate[]
  maxQuantity: number
}
// const bb ={

// }