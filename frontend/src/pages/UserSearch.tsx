import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Search, UserPlus, UserMinus, Globe, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{_id: string, username: string, name?: string, avatar?: string, isFollowed: boolean}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await userService.search(query, 1, 24);
      setResults(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('System connection error. Unable to retrieve network nodes.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await userService.followUser(userId);
      setResults(prev => prev.map(u => u._id === userId ? { ...u, isFollowed: true } : u));
    } catch (err) {
      console.error('Follow failed', err);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await userService.unfollowUser(userId);
      setResults(prev => prev.map(u => u._id === userId ? { ...u, isFollowed: false } : u));
    } catch (err) {
      console.error('Unfollow failed', err);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                 <Globe className="h-3 w-3" />
                 <span>Global Network Discovery</span>
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic">
                 Expand your <span className="text-primary italic">Ecosystem</span>
              </h1>
              <p className="text-muted-foreground max-w-md text-sm">
                 Discover and connect with developers worldwide. Build your semantic network.
              </p>
           </div>

           <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <input 
               type="text" 
               value={query} 
               onChange={e => setQuery(e.target.value)} 
               placeholder="Search identifiers..." 
               className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium"
             />
           </form>
        </div>

        {/* Results Grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 opacity-50">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
             ))}
          </div>
        )}

        {error && (
          <div className="p-8 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center font-bold">
            {error}
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
             <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
             <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No matching nodes found in the network</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((user, idx) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-white/5 border-white/5 hover:bg-white/10 transition-all group overflow-hidden h-full">
                <CardContent className="p-6">
                   <div className="flex items-start justify-between mb-6">
                      <Avatar className="h-16 w-16 border-2 border-primary/20 p-1 bg-background ring-4 ring-primary/5">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-primary/5 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                         <Zap className="h-4 w-4 text-primary" />
                      </div>
                   </div>

                   <div className="space-y-1 mb-6">
                      <h3 className="font-black text-lg tracking-tight uppercase group-hover:text-primary transition-colors">{user.username}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none flex items-center">
                        <Shield className="h-2 w-2 mr-1.5 text-primary/50" />
                        Developer_Node_{user._id.slice(-4)}
                      </p>
                   </div>

                   <div className="flex items-center gap-3">
                      {user.isFollowed ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold uppercase text-[9px] tracking-widest"
                          onClick={() => handleUnfollow(user._id)}
                        >
                          <UserMinus className="h-3 w-3 mr-2" />
                          Unfollow
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary text-background font-bold uppercase text-[9px] tracking-widest"
                          onClick={() => handleFollow(user._id)}
                        >
                          <UserPlus className="h-3 w-3 mr-2" />
                          Connect
                        </Button>
                      )}
                      
                      <Button asChild variant="ghost" size="sm" className="px-3 border border-white/5 hover:bg-white/10">
                        <motion.a href={`/profile/${user._id}`} whileHover={{ x: 3 }}>
                           <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        </motion.a>
                      </Button>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
