import { useState } from 'react';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{_id: string, username: string, name?: string, isFollowed: boolean}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await userService.search(query, page, 12);
      setResults(data.users);
    } catch (err: any) {
      setError('Failed to load users.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    await userService.followUser(userId);
    handleSearch();
  };
  const handleUnfollow = async (userId: string) => {
    await userService.unfollowUser(userId);
    handleSearch();
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <form className="mb-4 flex" onSubmit={handleSearch}>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users..." className="flex-1 p-2 border rounded-l" />
        <Button type="submit" className="rounded-l-none">Search</Button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400 py-2">{error}</div>}
      <ul className="divide-y">
        {results.map((user) => (
          <li key={user._id} className="flex items-center justify-between py-3">
            <div>
              <span className="font-semibold">{user.username}</span> {user.name && <span className="text-gray-400">({user.name})</span>}
            </div>
            {user.isFollowed ? (
              <Button variant="outline" size="sm" onClick={() => handleUnfollow(user._id)}>Unfollow</Button>
            ) : (
              <Button size="sm" onClick={() => handleFollow(user._id)}>Follow</Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
