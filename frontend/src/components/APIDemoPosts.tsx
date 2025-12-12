import { useEffect, useState } from "react";
import postsApi from "../api/posts";

type Post = {
  _id: string;
  content?: string;
  imageUrl?: string;
  userId?: { username?: string; profilePicUrl?: string } | string;
  createdAt?: string;
};

export default function APIDemoPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postsApi.listPosts();
        setPosts(data);
      } catch (e: any) {
        setError(e?.response?.data?.msg || e.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Posts Feed (API Demo)</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="space-y-4">
        {posts?.map((p) => (
          <div key={p._id} className="rounded border border-gray-200 bg-white shadow p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="text-sm text-gray-700">{typeof p.userId === 'object' ? p.userId?.username : 'User'}</div>
              <div className="ml-auto text-xs text-gray-400">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
            </div>
            {p.content && <div className="text-gray-800 mb-2">{p.content}</div>}
            {p.imageUrl && (
              <img src={p.imageUrl} alt="post" className="rounded max-h-64 object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


