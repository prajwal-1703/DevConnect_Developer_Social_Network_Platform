import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { postsService } from '@/services/postsService';
import type { CreatePostData } from '@/services/postsService';
import { useAuth } from '@/contexts/AuthContext';
import { commentsService } from '@/services/commentsService';

function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await commentsService.getPostComments(postId);
      setComments(res ?? []);
    } catch (error) {
      toast({ title: 'Failed to load comments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadComments(); }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await commentsService.createComment({ postId, text: newComment });
      setNewComment('');
      loadComments();
    } catch (error) {
      toast({ title: 'Failed to add comment', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-muted rounded-lg p-3 mt-2 space-y-2">
      <div className="font-semibold text-sm mb-1">Comments</div>
      {loading ? (
        <div className="text-xs text-muted-foreground">Loading...</div>
      ) : comments.length === 0 ? (
        <div className="text-xs text-muted-foreground">No comments yet</div>
      ) : (
        <ul className="space-y-1 max-h-32 overflow-y-auto">
          {comments.map((comment: any) => (
            <li key={comment.id || comment._id}>
              <span className="font-medium">{comment.author?.username || 'User'}:</span> {comment.text}
              <span className="text-xs text-muted-foreground ml-2">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</span>
            </li>
          ))}
        </ul>
      )}
      <form className="flex gap-2 pt-2" onSubmit={handleAddComment}>
        <input
          className="flex-1 border rounded px-2 py-1 text-sm bg-background"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          disabled={submitting}
        />
        <button type="submit" disabled={submitting || !newComment.trim()} className="text-sm bg-primary px-3 py-1 rounded text-primary-foreground">
          Post
        </button>
      </form>
    </div>
  );
}

export default function Feed() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Fetch posts from API
  const loadPosts = async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      const res = await postsService.getPosts();
      const fetchedPosts = res ?? [];
      setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
    } catch (error) {
      toast({
        title: 'Failed to load posts',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setPosts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // ✅ Create new post
  const handleCreatePost = async (postData: CreatePostData) => {
    try {
      const newPost = await postsService.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      toast({
        title: 'Failed to create post',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  // ✅ Like / Unlike post
  const handleLikePost = async (postId: string) => {
    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;

      if (post.isLiked) {
        await postsService.unlikePost(postId);
      } else {
        await postsService.likePost(postId);
      }
      loadPosts(true);
    } catch (error) {
      toast({
        title: 'Failed to like post',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  // ✅ Delete post
  const handleDeletePost = async (postId: string) => {
    try {
      await postsService.deletePost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (error) {
      toast({
        title: 'Failed to delete post',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const { followUser, unfollowUser } = useAuth();
  
  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      loadPosts(true);
    } catch {
      toast({
        title: 'Failed to follow user',
        variant: 'destructive',
      });
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
      loadPosts(true);
    } catch {
      toast({
        title: 'Failed to unfollow user',
        variant: 'destructive',
      });
    }
  };

  const handleRefresh = () => {
    loadPosts(true);
  };

  // ✅ Loading UI
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your feed...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Main Feed UI
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            Your Feed
          </motion.h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-primary/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Create Post */}
        <CreatePost onCreatePost={handleCreatePost} />

        {/* Posts */}
        <div className="space-y-6">
          {Array.isArray(posts) && posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 space-y-4"
            >
              <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No posts yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Be the first to share something with the community! Create a post above to get started.
              </p>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard
                  post={post}
                  onLike={handleLikePost}
                  onDelete={handleDeletePost}
                  onFollow={handleFollow}
                  onUnfollow={handleUnfollow}
                />
                <CommentSection postId={post._id} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
