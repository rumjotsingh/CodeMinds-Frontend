'use client'
export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-[#303030] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Brand */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-xl text-[#00b8a3] tracking-tight">
            CodeMinds
          </h3>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col justify-center items-center space-y-3 md:flex-row md:space-y-0 md:space-x-8">
          <li>
            <a 
              href="/about-us" 
              className="text-[#eff1f6bf] hover:text-[#00b8a3] transition-colors font-medium"
            >
              About Us
            </a>
          </li>
          <li>
            <a 
              href="/carrer" 
              className="text-[#eff1f6bf] hover:text-[#00b8a3] transition-colors font-medium"
            >
              Careers
            </a>
          </li>
          <li>
            <a 
              href="/privacy" 
              className="text-[#eff1f6bf] hover:text-[#00b8a3] transition-colors font-medium"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a 
              href="/contact" 
              className="text-[#eff1f6bf] hover:text-[#00b8a3] transition-colors font-medium"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Copyright */}
        <div className="text-center text-sm text-[#eff1f6bf] mt-6">
          © {new Date().getFullYear()} CodeMinds. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
