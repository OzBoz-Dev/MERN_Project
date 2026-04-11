'use client';

import { usePathname } from 'next/navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes in which to hide the top bar and remove padding
  const hiddenRoutes = ['/auth'];
  const shouldHideNav = hiddenRoutes.some(route => pathname.startsWith(route));

  return (
    <main style={{ paddingTop: shouldHideNav ? 0 : 60 }}>
      {children}
    </main>
  );
}