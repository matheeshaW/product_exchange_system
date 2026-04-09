import type { ReactNode } from 'react';
import Navbar from '../components/Navbar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />

      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;