'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/Component/Footer';

const FooterWrapper = () => {
  const pathname = usePathname();

  // Routes where footer should be hidden
  const hideFooterOn = ['/problem', '/dashboard/admin'];

  // Match for exact or dynamic routes like /problem/123
  const shouldHide = hideFooterOn.some((path) => pathname.startsWith(path));

  return shouldHide ? null : <Footer />;
};

export default FooterWrapper;
