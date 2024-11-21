import provinceRequest from "~/constants/provinceRequest";


const provinceApi = {
  cityApi: () => provinceRequest.get('api/'),
  districtApi: (city) => provinceRequest.get(`api/p/${city}?depth=2`),
  wardApi: (district) => provinceRequest.get(`api/d/${district}?depth=2`),
} 
export default provinceApi;