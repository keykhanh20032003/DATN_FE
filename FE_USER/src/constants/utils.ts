export const API_URL = "http://localhost:8080";
export const API_URL_IMAGE = "/src/static/images/";

const formatPrice = (price: number): string => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

  return formattedPrice;
};
export {formatPrice} ;