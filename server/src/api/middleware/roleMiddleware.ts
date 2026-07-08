import type { Request, Response, NextFunction } from "express";
import { IUserToken } from "@/types/userToken.types";

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as IUserToken;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: No user found in request",
                success: false
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: `Forbidden: You do not have permission to perform this action. Required roles: ${allowedRoles.join(", ")}`,
                success: false
            });
        }

        next();
    };
};
