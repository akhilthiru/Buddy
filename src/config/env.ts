export interface Env {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRY_SECONDS: number;
  JWT_REFRESH_EXPIRY_SECONDS: number;
  ENCRYPTION_KEY: string;
  HMAC_SALT: string;
  COOKIE_SECRET: string;
  CORS_ORIGIN: string;
  GEMINI_API_KEY?: string;
}

export const env: Env = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/flatmate',
  JWT_SECRET: process.env.JWT_SECRET || 'flatmate-super-secret-jwt-access-key-2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'flatmate-super-secret-refresh-key-2026',
  JWT_ACCESS_EXPIRY_SECONDS: process.env.JWT_ACCESS_EXPIRY_SECONDS
    ? parseInt(process.env.JWT_ACCESS_EXPIRY_SECONDS, 10)
    : 900, // 15 mins
  JWT_REFRESH_EXPIRY_SECONDS: process.env.JWT_REFRESH_EXPIRY_SECONDS
    ? parseInt(process.env.JWT_REFRESH_EXPIRY_SECONDS, 10)
    : 1209600, // 14 days
  ENCRYPTION_KEY:
    process.env.ENCRYPTION_KEY ||
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  HMAC_SALT: process.env.HMAC_SALT || 'flatmate-hmac-salt-key-tvm',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'flatmate-cookie-secret-2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
