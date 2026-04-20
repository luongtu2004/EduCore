import { CRMSidebar } from '@/components/layout/crm-sidebar';
import ReactQueryProvider from '@/lib/react-query';
import { SocketProvider } from '@/lib/socket-provider';

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <SocketProvider>
        <div className="flex h-screen bg-slate-950 overflow-hidden">
          {/* CRM Sidebar - Dark Mode Structure */}
          <CRMSidebar />
          
          {/* Main Content CRM - Dark Mode Content area */}
          <main className="flex-1 overflow-y-auto bg-slate-900 custom-scrollbar text-slate-400">
            {children}
          </main>
        </div>
      </SocketProvider>
    </ReactQueryProvider>
  );
}
