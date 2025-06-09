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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Community Forms</h1>
        <p className="text-xl text-gray-600 mt-4">
          Join our community to share your thoughts and connect with others.
        </p>
        {!isAuthenticated && (
          <div className="mt-8">
            <a
              href="/login"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 mr-4"
            >
              Login
            </a>
            <a
              href="/register"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Register
            </a>
          </div>
        )}
        {isAuthenticated && (
          <div className="mt-8">
            <a
              href="/dashboard"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Go to Dashboard
            </a>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="text-sm text-gray-500">
                Posted by {post.author.name} on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-600">No posts yet. Be the first to share!</p>
          )}
        </div>
      </div>
    </div>
  );
}
