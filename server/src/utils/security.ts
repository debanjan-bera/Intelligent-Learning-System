import { IUserToken } from "@/types/userToken.types";
import jwt, { SigningOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

export class JWTSecurity {
    static generateToken({
        userId,
        email,
        role,
        name
    }: IUserToken): string {
        const options : SigningOptions  = {
            expiresIn: process.env.ACCESS_TOKEN_AGE as any
        };
        return jwt.sign({ userId, email, role, name }, process.env.JWT_SECRET as string, options);
    }
    static verifyToken(token: string) {
       try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as IUserToken;
       } catch (error) {
        return null;
       }
    }
}

export class PasswordSecurity {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        return bcrypt.hash(password, salt);
    }
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}