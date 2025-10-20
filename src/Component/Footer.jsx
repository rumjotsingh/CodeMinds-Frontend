'use client'
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1E293B] border-t border-[#CBD5E1] dark:border-[#334155] py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-[1200px] mx-auto">
        {/* Brand */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl text-[#6366F1] dark:text-[#818CF8] tracking-tight">
            CodeMinds
          </h3>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col justify-center items-center space-y-3 md:flex-row md:space-y-0 md:space-x-8">
          <li>
            <a 
              href="/about-us" 
              className="text-[#111827] dark:text-[#E2E8F0] hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors font-medium"
            >
              About Us
            </a>
          </li>
          <li>
            <a 
              href="/carrer" 
              className="text-[#111827] dark:text-[#E2E8F0] hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors font-medium"
            >
              Careers
            </a>
          </li>
          <li>
            <a 
              href="/privacy" 
              className="text-[#111827] dark:text-[#E2E8F0] hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors font-medium"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a 
              href="/contact" 
              className="text-[#111827] dark:text-[#E2E8F0] hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors font-medium"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          © {new Date().getFullYear()} CodeMinds. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
