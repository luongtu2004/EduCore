'use client';

import { Sidebar } from '@/components/layout/sidebar';
import ReactQueryProvider from '@/lib/react-query';
import { SocketProvider } from '@/lib/socket-provider';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we are in the CRM section
  const isCRM = pathname?.startsWith('/admin/crm');

  return (
    <ReactQueryProvider>
      <SocketProvider>
        <div className="flex min-h-screen bg-slate-50">
          {/* 
             Only render the CMS Sidebar if NOT in the CRM section.
             CRM handles its own specialized sidebar in its sub-layout.
          */}
          {!isCRM && <Sidebar />}
          
          <main className={`flex-1 overflow-y-auto ${!isCRM ? 'ml-72' : ''}`}>
            {children}
          </main>
        </div>
      </SocketProvider>
    </ReactQueryProvider>
  );
}
