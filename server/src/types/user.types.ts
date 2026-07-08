export interface IUser {
  email: string;
  password: string;
  name: string;
  role: "student" | "admin";
}