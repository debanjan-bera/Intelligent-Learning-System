import "express";
import { IUserToken } from "./types/userToken.types";

declare global {
  namespace Express {
    interface Request {
      user?: IUserToken;
    }
  }
}
