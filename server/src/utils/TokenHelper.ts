import { Request } from "express";
import jsonwebtoken, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import moment from "moment";
import { JWT_CONFIG } from "@config/jwt.config";

type PayloadType = {
  username: string;
  application_id: string;
};

export const generateAccessToken = (payload: PayloadType) => {
  const token = jsonwebtoken.sign({ ...payload }, JWT_CONFIG.accessSecret, {
    algorithm: "HS256",
    expiresIn: JWT_CONFIG.jwtExpiration,
  });

  const now = moment();

  return {
    token,
    expiresIn: JWT_CONFIG.jwtExpiration,
    expiresAt: now.add(JWT_CONFIG.jwtExpiration, "seconds").toISOString(true),
  };
};

export const generateRefreshToken = (payload: PayloadType) => {
  const token = jsonwebtoken.sign({ ...payload }, JWT_CONFIG.refreshSecret, {
    algorithm: "HS256",
    expiresIn: JWT_CONFIG.jwtRefreshExpiration,
  });

  const now = moment();

  return {
    token,
    expiresIn: JWT_CONFIG.jwtRefreshExpiration,
    expiresAt: now
      .add(JWT_CONFIG.jwtRefreshExpiration, "seconds")
      .toISOString(true),
  };
};

export const getBearerTokenFromHeader = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const splitedBearerToken = req.headers.authorization.split(" ");
    if (splitedBearerToken.length === 2) {
      console.info("Success get Bearer token from headers.");
      return req.headers.authorization.split(" ")[1];
    }
  }
  console.warn("Cannot get Bearer token from headers.");
  return null;
};

export const verifyToken = <T = JwtPayload>(
  token: string,
  isRefresh = false
): T => {
  const secret = isRefresh ? JWT_CONFIG.refreshSecret : JWT_CONFIG.accessSecret;
  try {
    const decoded = jsonwebtoken.verify(token, secret);
    return decoded as T;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new TokenExpiredError("Token was expired.", error.expiredAt);
    }
    throw new Error("Invalid token.");
  }
};
