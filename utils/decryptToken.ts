import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/auth';

interface JwtPayload {
  id: string;
  email: string;
  type: string;
  status: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    picture?: string;
    provider?: 'google' | 'email';
  };
  isEmailVerified: boolean;
  needsCompletion: boolean;
  iat: number;
  exp: number;
}

export const decryptToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    return {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      status: decoded.status,
      profile: decoded.profile,
      isEmailVerified: decoded.isEmailVerified,
      needsCompletion: decoded.needsCompletion,
      createdAt: new Date(decoded.iat * 1000).toISOString(),
      updatedAt: new Date(decoded.iat * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}; 