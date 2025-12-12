import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import type { User } from '@/services/userService';

interface FollowListProps {
  type: 'followers' | 'following';
  count: number;
  users?: User[];
  onFollow?: (userId: string) => Promise<void>;
  onUnfollow?: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

export const FollowList: React.FC<FollowListProps> = ({
  type,
  count,
  users = [],
  onFollow,
  onUnfollow,
  isLoading = false,
}) => {
  const { user: currentUser } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm text-muted-foreground capitalize">{type}</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">{type}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto px-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No {type} yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <Link
                    to={`/profile/${user.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar || user.profilePicUrl} alt={user.username} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {user.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>
                      )}
                    </div>
                  </Link>
                  
                  {currentUser?.id !== user.id && (
                    user.isFollowing ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-4"
                        onClick={() => onUnfollow?.(user.id)}
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="ml-4 bg-gradient-primary hover:opacity-90"
                        onClick={() => onFollow?.(user.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </Button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};