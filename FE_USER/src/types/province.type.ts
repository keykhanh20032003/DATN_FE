export interface City {
  code: number;
  codename: string;
  division_type: string;
  name: string;
}
export interface District {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  province_code: number;
}
export interface Ward {
  code: number;
  codename: string;
  district_code: number;
  division_type: string;
  name: string;
}