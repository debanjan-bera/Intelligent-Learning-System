import type { ErrorResponse, LoginPayload, MeResponse, RegisterPayload } from "@/@types/interface/auth.interface";
import { get, post } from "@/utils/api/apiMethod";

const ROUTE = "auth";

const getToken = () => {
  const token = localStorage.getItem("access_token");
  return token || undefined;
};

export const me = async (): Promise<MeResponse | ErrorResponse> => {
  try {
    const response = await get(`${ROUTE}/me`, {}, getToken());
    if (response && response.success && response.user) {
      return {
        ...response.user,
        id: response.user.userId || response.user.id,
      } as MeResponse;
    }
    return { error: "Failed to fetch user info" };
  } catch (error) {
    if (error instanceof Error && error.message === "No access token found") {
      return { error: "No access token found" };
    }
    return { error: "Failed to fetch user info" };
  }
};

export const login = async (payload: LoginPayload) => {
  return await post(`${ROUTE}/login`, payload);
};

export const register = async (payload: RegisterPayload) => {
  return await post(`${ROUTE}/register`, payload);
};