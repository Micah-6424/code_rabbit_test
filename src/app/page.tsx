'use client';

import { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

/**
 * Renders the community home page with a welcome message, authentication-dependent navigation, and a list of recent posts.
 *
 * Displays login and registration options for unauthenticated users, or a dashboard link for authenticated users. Shows recent posts in a grid layout, and if no posts exist, provides a call-to-action for authenticated users to create their first post.
 */
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Community Forms
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Join our community to share your thoughts and connect with others in a modern,
          engaging environment.
        </p>
        {!isAuthenticated && (
          <div className="flex justify-center gap-4">
            <a
              href="/login"
              className="px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-all shadow-sm"
            >
              Register Now
            </a>
          </div>
        )}
        {isAuthenticated && (
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-all shadow-sm"
          >
            Go to Dashboard
          </a>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Recent Posts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="card p-6 bg-white dark:bg-gray-800 fade-in"
            >
              <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {post.author.name}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-xl">No posts yet. Be the first to share!</p>
              </div>
              {isAuthenticated && (
                <a
                  href="/dashboard"
                  className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-all shadow-sm"
                >
                  Create Your First Post
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
