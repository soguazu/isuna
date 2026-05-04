import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/shared/components/Sidebar';

export const AppLayout = () => (
  <div className="app-layout">
    <Sidebar />
    <main className="app-layout__main">
      <Outlet />
    </main>
  </div>
);
