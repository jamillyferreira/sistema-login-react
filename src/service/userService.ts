// userService.ts
import type { UserResponse } from "../interfaces/auth";
import { api } from "./api";

async function getMe(): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>("/users/me");
  return data;
}

export default getMe;
