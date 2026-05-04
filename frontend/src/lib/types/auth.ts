export type UserRole = 'super_admin' | 'admin' | 'manager' | 'viewer';

export type AuthUser = {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
};

export type LoginResult = {
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
};
