export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

export interface SuccessResponse<Data> {
  message?: string;
  data: Data | string;
  status?: number;
  code: number;
}