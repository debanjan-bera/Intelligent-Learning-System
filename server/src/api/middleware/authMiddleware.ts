import { IUserToken } from "@/types/userToken.types";
import { JWTSecurity } from "@/utils/security";
import type { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    
    try {
        const decoded = JWTSecurity.verifyToken(token);
        if (decoded) {
            (req as any).user = decoded as IUserToken;
            next();
        } else {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Unauthorized: Token verification failed" });
        return;
    }
};

export default authMiddleware;