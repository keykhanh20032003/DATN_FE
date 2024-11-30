import { SuccessResponse } from "./utils.type";
import { User } from "./user.type";

export type AuthResponse = SuccessResponse<{
  token: string;
  user: User;
}>;