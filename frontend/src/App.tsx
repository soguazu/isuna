import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProductListPage } from '@/features/products/pages/ProductListPage';
import { UserListPage } from '@/features/users/pages/UserListPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { AppLayout } from '@/shared/layouts/AppLayout';

export const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route
      element={
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      }
    >
      <Route index element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/users" element={<UserListPage />} />
      <Route path="/me" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<Navigate to="/products" replace />} />
  </Routes>
);
