import { Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import type { JwtDecodedPayload } from "types/jwt";
import type { LoginRequest } from "types/request";
import { User } from "@database/models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  getBearerTokenFromHeader,
  verifyToken,
} from "@utils/TokenHelper";

const AuthController = {
  auth: async (req: Request, res: Response) => {
    const refreshToken = getBearerTokenFromHeader(req);
    if (!refreshToken) {
      return res.status(401).json({
        code: 4010,
        description: "UnAuthorization refresh token not found in request",
      });
    }

    let decoded: JwtDecodedPayload;
    try {
      decoded = verifyToken<JwtDecodedPayload>(refreshToken, true);
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        return res.status(401).json({
          code: 4010,
          description: "UnAuthorization refresh token was expired.",
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
        description: "Internal Server Error. Unkown error occurred.",
      });
    }

    const newAccessToken = generateAccessToken({
      username: decoded.username,
      application_id: decoded.application_id,
    });
    const newRefreshToken = generateRefreshToken({
      username: decoded.username,
      application_id: decoded.application_id,
    });

    const { token, expiresIn, expiresAt } = newAccessToken;

    return res.status(200).json({
      access_token: token,
      expires_in: expiresIn,
      expires_at: expiresAt,
      refresh_token: newRefreshToken.token,
      user: {
        username: decoded.username,
      },
    });
  },

  login: async (
    req: Request<undefined, undefined, LoginRequest, undefined>,
    res: Response
  ) => {
    const { username, password, applicationId } = req.body;
    if (!username || !password || !applicationId) {
      return res.status(400).json({
        code: 4000,
        description:
          "Invalid parameter. Must be set username, password and applicationId",
      });
    }

    try {
      const user = await User.findOne({
        where: {
          username,
          password,
          application_id: applicationId,
        },
        raw: true,
        nest: true,
      });

      if (!user) {
        return res.status(404).json({
          code: 4040,
          description: "User not found.",
        });
      }

      const accessToken = generateAccessToken({
        username: user.username,
        application_id: user.application_id,
      });
      const refreshToken = generateRefreshToken({
        username: user.username,
        application_id: user.application_id,
      });

      const { token, expiresIn, expiresAt } = accessToken;

      return res.status(200).json({
        access_token: token,
        expires_in: expiresIn,
        expires_at: expiresAt,
        refresh_token: refreshToken.token,
        user: {
          username: user.username,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        code: 5000,
        description: "Internal server error. Database error occurred.",
      });
    }
  },
};

export { AuthController };
