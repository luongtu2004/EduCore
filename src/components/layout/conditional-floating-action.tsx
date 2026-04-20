'use client';

import { usePathname } from 'next/navigation';
import { FloatingAction } from './floating-action';

export function ConditionalFloatingAction() {
  const pathname = usePathname();
  
  // Không hiển thị trên các trang Admin hoặc trang Login/Register
  const isExcluded = pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/register');
  
  if (isExcluded) return null;
  
  return <FloatingAction />;
}
