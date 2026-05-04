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
];
const rolePermissions = {
    super_admin: [...permissions],
    admin: ['products:read', 'products:create', 'products:update', 'products:delete', 'users:read:list', 'users:read:any'],
    manager: ['products:read', 'products:create', 'products:update'],
    viewer: ['products:read']
};
export const hasPermission = (user, permission) => rolePermissions[user.role].includes(permission);
export const canReadUser = (actor, target) => actor.id === target.id || hasPermission(actor, 'users:read:any');
export const canUpdateUser = (actor, target) => actor.id === target.id || hasPermission(actor, 'users:update:any');
export const canDisableUser = (actor, target) => actor.id !== target.id && hasPermission(actor, 'users:disable');
