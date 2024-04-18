import { JwtPayload } from 'jsonwebtoken';

export interface JwtDecodedPayload extends JwtPayload {
  username: string;
  application_id: string;
}
