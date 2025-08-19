import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="h-full w-full flex flex-grow flex-col gap-y-10 items-center mt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
