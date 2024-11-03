export interface Category {
  description: string;
  id: number;
  status: number;
  title: string;
  type: number;
  urlImage: any;
  banners: Banner;
  createdDate: string;
  modifiedDate: string;
  categoryParent: number | null,
  childCategories: ChildCategories;
}
export interface Banner {

}
export interface ChildCategories{
  description: string;
  id: number;
  status: number;
  title: string;
  type: number;
  urlImage: any;
  banners: Banner;
}