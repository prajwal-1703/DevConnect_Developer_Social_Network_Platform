import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: any;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onDelete,
  onFollow,
  onUnfollow,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // ✅ Normalize backend data
  const postId = post._id;
  const author = post.author || post.userId || {
    _id: '',
    username: 'Unknown User',
    name: '',
    avatar: '',
    isFollowed: false,
  };

  const [isPending, setIsPending] = useState(false);
  const [isFollowed, setIsFollowed] = useState(author.isFollowed || false);
  const isOwner = user?.id === author._id;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!post || !postId) return null;

  // ✅ Like handler
  const handleLike = async () => {
    if (!onLike || isPending) return;
    try {
      setIsPending(true);
      await onLike(postId);
    } catch {
      toast({ title: 'Error', description: 'Failed to update like status', variant: 'destructive' });
    } finally {
      setIsPending(false);
    }
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete(postId);
      toast({
        title: 'Post deleted',
        description: 'Your post has been deleted successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  // ✅ Follow/Unfollow handlers
  const handleFollow = async () => {
    if (onFollow) {
      await onFollow(author._id);
      setIsFollowed(true);
    }
  };

  const handleUnfollow = async () => {
    if (onUnfollow) {
      await onUnfollow(author._id);
      setIsFollowed(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-panel/30 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to={author._id ? `/profile/${author._id}` : '#'}>
                <Avatar className="h-10 w-10 ring-2 ring-primary/10 hover:ring-primary/20 transition-all">
                  <AvatarImage src={author.avatar || ''} alt={author.username} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    {author.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link
                  to={author._id ? `/profile/${author._id}` : '#'}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {author.username}
                </Link>

                {!isOwner && author._id && (
                  <div className="ml-2">
                    {isFollowed ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleUnfollow}
                        className="text-xs"
                      >
                        <UserMinus className="h-3 w-3 mr-1" />
                        Unfollow
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        variant="default"
                        onClick={handleFollow}
                        className="bg-gradient-primary hover:opacity-90 text-xs"
                      >
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </Button>
                    )}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  {post.createdAt
                    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                    : 'Just now'}
                </p>
              </div>
            </div>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        {/* ✅ Post content */}
        <CardContent className="pb-3">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
          {(post.imageUrl || post.image) && (
            <img
              src={post.imageUrl || post.image}
              alt="Post image"
              className="max-w-full max-h-80 rounded-md mt-3 border cursor-pointer"
              onClick={() => setPreviewUrl((post.imageUrl || post.image) as string)}
            />
          )}
          {post.codeSnippet && (
            <div className="relative group mt-3">
              <pre className="bg-gray-900 text-orange-200 rounded p-3 pr-10 overflow-x-auto text-sm">
                <code>{post.codeSnippet}</code>
              </pre>
              <button
                type="button"
                className="absolute top-2 right-2 p-1 rounded border bg-black/20"
                aria-label="Copy code"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(post.codeSnippet || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch (e) {
                    // ignore
                  }
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t border-border">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isPending}
                className={`${
                  post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
                } transition-colors`}
              >
                <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.likesCount || post.likes?.length || 0}
              </Button>

              <Link to={`/posts/${postId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments?.length || 0}
                </Button>
              </Link>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl p-0 bg-background">
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
