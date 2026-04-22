import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="container mx-auto px-6 pt-28 pb-12">
        {children}
      </main>
    </div>
  );
};