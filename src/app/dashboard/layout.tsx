import { MenuAside } from "../components/MenuAside";
import { MenuHeader } from "../components/MenuHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <MenuAside />
      <div className="flex-1 flex flex-col">
        <MenuHeader />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 