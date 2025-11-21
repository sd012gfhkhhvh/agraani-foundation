import Link from 'next/link';
import { Facebook, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Agraani Welfare Foundation</h3>
            <p className="text-gray-300 max-w-md">
              An organization focused on Women and Child Education, Training & Development,
              and enabling self-dependence in West Bengal, India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-300 hover:text-white transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-300 hover:text-white transition-colors">
                  Legal Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:agraaniwelfarefoundation@gmail.com" className="hover:text-white">
                  Email Us
                </a>
              </li>
            </ul>
            
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.facebook.com/share/1Gyuj8ASUE/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com/@agraaniwelfarefoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Agraani Welfare Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
