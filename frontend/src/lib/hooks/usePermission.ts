import { useAuth } from '@/features/auth/context/AuthContext';
import type { UserRole } from '@/lib/types/auth';

type Permission =
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  | 'users:read:list'
  | 'users:read:any'
  | 'users:create'
  | 'users:update:any'
  | 'users:disable';

const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'products:read', 'products:create', 'products:update', 'products:delete',
    'users:read:list', 'users:read:any', 'users:create', 'users:update:any', 'users:disable',
  ],
  admin: [
    'products:read', 'products:create', 'products:update', 'products:delete',
    'users:read:list', 'users:read:any',
  ],
  manager: ['products:read', 'products:create', 'products:update'],
  viewer: ['products:read'],
};

export const usePermission = () => {
  const { user } = useAuth();

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) ?? false;
  };

  return { can };
};
