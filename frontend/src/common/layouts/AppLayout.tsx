import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 p-3 sm:p-4">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Navbar />

          <main className="space-y-4">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;