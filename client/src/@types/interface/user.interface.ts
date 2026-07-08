export interface AdminUser {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: "student" | "admin";
    status: "active" | "inactive";
    avatar: string; // Initial/Letter
    joinedDate: string;
    enrolledCourses: number;
    quizzesCompleted: number;
    averageScore: number;
}

export interface UserResponse {
    message: string;
    success: boolean;
    data: AdminUser[];
}

export interface SingleUserResponse {
    message: string;
    success: boolean;
    data: AdminUser;
}
