import { Outlet } from 'react-router-dom';
import Header from '../migrated/components/Header';
import Footer from '../migrated/components/Footer';

export function MigratedLayout() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500/30">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
