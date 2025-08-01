'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/Component/Footer';

const FooterWrapper = () => {
  const pathname = usePathname();

  // Hide footer on these routes
  const hideFooterOn = ['/problem']; // Add more paths if needed
  const shouldHide = hideFooterOn.includes(pathname);

  return shouldHide ? null : <Footer />;
};

export default FooterWrapper;
