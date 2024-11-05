const path = {
  home:'/',
  login: "/login",
  register: '/register',

  //profile
  profile: '/profile',
  address: '/profile-address',
  detailOrder: '/detail-order',
  
  //category:
  detailCategory: '/detail-category',

  //sản phẩm
  product: '/product',
  collectionsProduct: '/collections-product',
  collections: '/collections',
  detailProduct: '/detail-product',
  searchProduct: 'search-product',

  //giỏ hàng
  cart: '/cart',
  //checkOut
  checkOut: '/check-out',
  thankYou: '/thank-you',
  //bài viết
  detailArticle: '/detail-article',
  article: '/article',

  //liên hệ
  contact: '/contact',
} as const;
 export default path;