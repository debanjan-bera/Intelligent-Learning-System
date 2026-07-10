import userModel from "@/models/user/user.model";
import { IUser } from "@/types/user.types";
import { JWTSecurity, PasswordSecurity } from "@/utils/security";

class AuthService {
    static async register({
        email,
        name,
        password,
        role,
    }:IUser) {
       try {
        const existingUser = await AuthService.checkDuplicateEmail(email);
        if (existingUser) {
            throw new Error("Email already in use");
        }
        const passwordHash = await PasswordSecurity.hashPassword(password);
        const newUser = new userModel({
            email,
            name,
            password: passwordHash,
            role
        });
        await newUser.save();
        const accessToken = JWTSecurity.generateToken({
            userId: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
            name: newUser.name
        });
        return { 
            user : newUser,
            accessToken
         };
       } catch (error) {
         throw new Error(error.message || "Registration failed");
       }
    }
    static async login({ email, password }: { email: string; password: string }) {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                throw new Error("Invalid email or password");
            }
            const isMatch = await PasswordSecurity.comparePassword(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid email or password");
            }
            const accessToken = JWTSecurity.generateToken({
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name
            });
            return { 
                user,
                accessToken
             };

        } catch (error) {
            throw new Error(error.message || "Login failed");
        }
    }
    static async checkDuplicateEmail(email: string) {
        if (await userModel.findOne({ email })) {
            throw new Error("Email already in use");
        }
        else {
            return false;
        }
    }
}

export default AuthService;