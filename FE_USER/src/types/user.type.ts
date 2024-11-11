import { Address } from "./address.type";

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  phone: string;
  image: string;
  createdDate: string;
  modifiedDate: string;
  roles: {
    name: string;
  }[];
  status: number;
  addresses: Address[];
}