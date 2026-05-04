import { loadEnv } from '@/config/env.js';
import { createContainer } from '@/container/create-container.js';

const env = loadEnv();

if (!env.superAdminEmail || !env.superAdminPassword) {
  throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required to seed the super admin');
}

const container = createContainer(env);

try {
  const user = await container.userService.ensureSuperAdmin({
    name: env.superAdminName ?? 'Super Admin',
    email: env.superAdminEmail,
    password: env.superAdminPassword
  });

  console.log(`Super admin ready: ${user.email}`);
} finally {
  await container.databaseContext.sequelize.close();
}
