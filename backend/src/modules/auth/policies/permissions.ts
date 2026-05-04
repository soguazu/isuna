import type { AuthenticatedUser, UserRole } from '@/modules/auth/auth.types.js';
import type { User } from '@/modules/users/repositories/user.repository.types.js';

export const permissions = [
  'products:read',
  'products:create',
  'products:update',
  'products:delete',
  'users:read:list',
  'users:read:any',
  'users:create',
  'users:update:any',
  'users:disable'
] as const;

export type Permission = (typeof permissions)[number];

const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [...permissions],
  admin: ['products:read', 'products:create', 'products:update', 'products:delete', 'users:read:list', 'users:read:any'],
  manager: ['products:read', 'products:create', 'products:update'],
  viewer: ['products:read']
};

export const hasPermission = (user: AuthenticatedUser, permission: Permission): boolean =>
  rolePermissions[user.role].includes(permission);

export const canReadUser = (actor: AuthenticatedUser, target: User): boolean =>
  actor.id === target.id || hasPermission(actor, 'users:read:any');

export const canUpdateUser = (actor: AuthenticatedUser, target: User): boolean =>
  actor.id === target.id || hasPermission(actor, 'users:update:any');

export const canDisableUser = (actor: AuthenticatedUser, target: User): boolean =>
  actor.id !== target.id && hasPermission(actor, 'users:disable');
