export const roles = ['super_admin', 'admin', 'manager', 'viewer'] as const;

export type UserRole = (typeof roles)[number];

export type AuthenticatedUser = {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
};

export type JwtClaims = AuthenticatedUser & {
  exp: number;
  iat: number;
};
