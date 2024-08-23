export type LoginFieldType = {
  username?: string;
  password?: string;
};

export type UserType = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type JwtPayload = {
  roles: string[];
  exp: number;
  sub: number;
  username: string;
};
export interface LoginUser {
  identifier: string;
  password: string;
}
export interface RegisterUser {
  username: string;
  password: string;
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  email: string;
}

export interface ForgotPassword {
  email: string;
}
