'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
 * Displays the user dashboard with authentication, post creation, and a list of user posts.
 *
 * Redirects unauthenticated users to the login page. Allows authenticated users to create new posts and view their existing posts. Shows error messages for failed operations.
 *
 * @remark Relies on a `token` stored in `localStorage` for authentication. If the token is missing, the user is redirected to `/login`.
 */
export default function Dashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchPosts();
  }, [router]);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError('Failed to fetch posts');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title');
    const content = formData.get('content');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      formRef.current?.reset();
      fetchPosts();
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        
        {/* Create Post Form */}
        <div className="card bg-white dark:bg-gray-800 p-8">
          <h2 className="text-2xl font-semibold mb-6">Create a New Post</h2>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 fade-in">
              {error}
            </div>
          )}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all"
                placeholder="Enter your post title"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all"
                placeholder="Write your post content here..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all shadow-sm"
            >
              Create Post
            </button>
          </form>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">Your Posts</h2>
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
            <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
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
              <p className="text-xl">You haven't created any posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 