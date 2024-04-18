import express from 'express';
import type { JwtDecodedPayload } from 'types/jwt';

declare module 'express' {
  interface Request {
    _devapp?: {
      token: JwtDecodedPayload;
    };
  }

  interface Response {}
}
