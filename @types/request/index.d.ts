import { Request } from 'express';

export interface LoginRequest {
  username?: string;
  password?: string;
  applicationId?: string;
}

export interface UserCreateRequest {
  create: {
    username: string;
    password: string;
  };
}
