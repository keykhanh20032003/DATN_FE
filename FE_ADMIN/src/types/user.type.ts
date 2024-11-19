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
export interface Address {
  addressDetail: string;
  createdDate: string;
  district: string;
  firstName: string;
  focus: number;
  id: number;
  lastName: string;
  modifiedDate: string;
  phone: string;
  province: string;
  status: number;
  wards: string;
}
// const bb = {
//   addressDetail
//   : 
//   "Nguyệt Dứcd"
//   createdDate
//   : 
//   "2023-09-05T14:00:01.000+07:00"
//   district
//   : 
//   "21"
//   firstName
//   : 
//   "Kim Thăng"
//   focus
//   : 
//   0
//   id
//   : 
//   1
//   lastName
//   : 
//   "Nguyễn "
//   modifiedDate
//   : 
//   "2023-09-05T15:39:17.000+07:00"
//   phone
//   : 
//   "0966821574"
//   province
//   : 
//   "1"
//   status
//   : 
//   1
//   wards
//   : 
//   "616"
// }