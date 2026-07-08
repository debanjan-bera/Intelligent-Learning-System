import type { AdminUser, UserResponse, SingleUserResponse } from "@/@types/interface/user.interface";
import { get } from "@/utils/api/apiMethod";

const ROUTE = "users";

const getToken = () => {
    const token = localStorage.getItem("access_token");
    return token || undefined;
};

export async function fetchAllStudents(): Promise<AdminUser[]> {
    const res: UserResponse = await get(`${ROUTE}/students`, {}, getToken());
    return res.data;
}

export async function fetchUserById(userId: string): Promise<AdminUser> {
    const res: SingleUserResponse = await get(`${ROUTE}/${userId}`, {}, getToken());
    return res.data;
}

export async function fetchStudentHistory(userId: string): Promise<any> {
    const res = await get(`${ROUTE}/${userId}/history`, {}, getToken());
    return res.data;
}
