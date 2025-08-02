'use client'
export default function Footer() {
  return (
 <footer className="bg-gray-900  max-w-7xl mx-auto text-white py-8 px-12 ">
   <div className="flex-shrink-0">
      <h3 className="font-bold mb-3 text-center text-yellow-400">CodeMinds</h3>
    </div>
  <div className="max-w-7xl mx-auto flex justify-around items-center gap-8 flex-wrap text-center">
    {/* Brand or Title */}
   

    {/* Navigation Links - vertical on mobile, horizontal on desktop */}
    <ul className="flex flex-col justify-center items-center space-y-4 md:flex-row md:space-y-0 md:space-x-8 ">
      <li>
        <a href="/about-us" className="hover:underline">
          About Us
        </a>
      </li>
      <li>
        <a href="/carrer" className="hover:underline">
          Careers
        </a>
      </li>
      <li>
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </li>
      <li>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
      </li>
    </ul>
  </div>

  {/* Copyright */}
  <div className="text-center text-xs text-gray-400 mt-8">
    © {new Date().getFullYear()} CodeMinds. All rights reserved.
  </div>
</footer>


  );
}
