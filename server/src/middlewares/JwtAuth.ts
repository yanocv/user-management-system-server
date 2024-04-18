import express, { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { getBearerTokenFromHeader, verifyToken } from "@utils/TokenHelper";
import type { JwtDecodedPayload } from "types/jwt";

const router = express.Router();

const JwtAuth = router.use(
  (req: Request, res: Response, next: NextFunction) => {
    const token = getBearerTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({
        code: 4011,
        description: "UnAuthorization access token not found in request",
      });
    }

    try {
      const decoded = verifyToken<JwtDecodedPayload>(token);
      req._devapp = { token: decoded };
      return next();
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({
          code: 4011,
          description: "UnAuthorization access token was expired.",
        });
      }
      if (error instanceof Error) {
        return res.status(401).json({
          code: 4010,
          description: error.message,
        });
      }
      return res.status(500).json({
        code: 5000,
        description: "Internal Server Error. Unknown error occurred.",
      });
    }
  }
);

export { JwtAuth };
