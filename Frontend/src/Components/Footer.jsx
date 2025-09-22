const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-3">Academic Hub</h1>
          <p className="text-gray-400 text-sm">
            Empowering students and guides to collaborate on projects, track
            progress, and share knowledge seamlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/" className="hover:text-white transition">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/mentors" className="hover:text-white transition">
                Guides
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Resources</h2>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/faq" className="hover:text-white transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="/tutorials" className="hover:text-white transition">
                Tutorials
              </a>
            </li>
            <li>
              <a href="/support" className="hover:text-white transition">
                Support
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Contact</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              Email:{" "}
              <a
                href="mailto:support@academichub.com"
                className="hover:text-white transition"
              >
                support@academichub.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+911234567890"
                className="hover:text-white transition"
              >
                +91 12345 67890
              </a>
            </li>
            <li>Address: 123 Academic St, Chennai, India</li>
          </ul>
          <div className="flex mt-4 space-x-4">
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,12A10,10 0 1,0 2,12A10,10 0 0,0 22,12ZM8.5,16V9H11V16H8.5ZM9.75,8A1.25,1.25 0 1,1 9.75,5.5A1.25,1.25 0 0,1 9.75,8ZM14.5,16H12V12.5C12,11.67 12.67,11 13.5,11C14.33,11 15,11.67 15,12.5V16H14.5Z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,4.01c-0.77,0.34-1.6,0.57-2.46,0.67C19.63,4.27,20,3.48,20.26,2.65C19.45,3.09,18.57,3.37,17.64,3.5C16.84,2.68,15.68,2.2,14.46,2.2C11.85,2.2,9.71,4.34,9.71,6.95C9.71,7.35,9.75,7.73,9.82,8.09C6.44,7.92,3.44,6.2,1.67,3.63C1.25,4.34,1,5.14,1,6C1,7.66,1.84,9.08,3.06,9.9C2.34,9.88,1.66,9.67,1.05,9.32V9.38C1.05,11.57,2.55,13.45,4.61,13.86C4.23,13.96,3.83,14.01,3.42,14.01C3.12,14.01,2.82,13.98,2.54,13.92C3.13,15.77,4.79,17.12,6.8,17.15C5.21,18.42,3.16,19.13,1,19.13C0.66,19.13,0.33,19.11,0,19.07C2.03,20.38,4.44,21.2,7.01,21.2C14.45,21.2,18.86,14.32,18.86,8.2C18.86,8.03,18.86,7.85,18.85,7.67C19.68,7.09,20.45,6.37,21,5.54L22,4.01Z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2.04c-5.51,0-9.96,4.45-9.96,9.96c0,4.4,2.87,8.14,6.84,9.45v-6.7H9.02v-2.75h2.86v-2.1c0-2.83,1.69-4.39,4.28-4.39 c1.24,0,2.53,0.22,2.53,0.22v2.78h-1.42c-1.4,0-1.84,0.87-1.84,1.76v2.02h3.13l-0.5,2.75h-2.63v6.7c3.97-1.31,6.84-5.05,6.84-9.45 C21.96,6.49,17.51,2.04,12,2.04z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-gray-800 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Academic Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
