'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

/**
 * Provides the main layout structure for the application, including a fixed navigation bar and authentication-aware navigation links.
 *
 * Renders a navigation bar with links that adapt based on the user's authentication state, and wraps the main content area with consistent styling and spacing.
 *
 * @param children - The content to be displayed within the main layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
          <div className="container mx-auto px-4 h-16">
            <div className="flex items-center justify-between h-full">
              <a 
                href="/" 
                className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Community Forms
              </a>
              <div className="flex items-center space-x-6">
                {!isAuthenticated ? (
                  <>
                    <a
                      href="/login"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Login
                    </a>
                    <a
                      href="/register"
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-opacity"
                    >
                      Register
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href="/dashboard"
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 pt-24 pb-12">{children}</main>
      </body>
    </html>
  );
}
