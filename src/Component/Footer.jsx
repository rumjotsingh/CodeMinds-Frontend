export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-12 mt-12">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">
        <div className="w-60">
          <h3 className="font-bold mb-3 text-yellow-400">CodeMinds</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/careers" className="hover:underline">Careers</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div className="w-60">
          <h3 className="font-bold mb-3 text-yellow-400">Learn</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/algorithms" className="hover:underline">Algorithms</a></li>
            <li><a href="/data-structures" className="hover:underline">Data Structures</a></li>
            <li><a href="/languages" className="hover:underline">Languages</a></li>
            <li><a href="/topics" className="hover:underline">Topics</a></li>
          </ul>
        </div>
        <div className="w-60">
          <h3 className="font-bold mb-3 text-yellow-400">Practice</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/company-wise" className="hover:underline">Company-wise</a></li>
            <li><a href="/topics-wise" className="hover:underline">Topic-wise</a></li>
            <li><a href="/contests" className="hover:underline">Contests</a></li>
            <li><a href="/discuss" className="hover:underline">Discuss</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} CodeMinds. All rights reserved.
      </div>
    </footer>
  );
}
