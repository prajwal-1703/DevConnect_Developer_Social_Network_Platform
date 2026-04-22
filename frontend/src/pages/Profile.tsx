import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Link as LinkIcon, 
  Github, 
  Calendar,
  Settings,
  UserPlus,
  UserMinus,
  Loader2,
  Camera,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  UserIcon
} from 'lucide-react';
import { FollowList } from '@/components/users/FollowList';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { projectsService } from '@/services/projectsService';
import type { User } from '@/services/userService';
import type { Project } from '@/services/projectsService';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, updateUser, followUser, unfollowUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
  
  const handleFollow = async () => {
    if (!user || isOwnProfile) return;
    
    try {
      await followUser(user.id);
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
      toast({
        title: `Following ${user.username}`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to follow user',
        variant: 'destructive',
      });
    }
  };

  const handleUnfollow = async () => {
    if (!user || isOwnProfile) return;
    
    try {
      await unfollowUser(user.id);
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(prev - 1, 0));
      toast({
        title: `Unfollowed ${user.username}`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to unfollow user',
        variant: 'destructive',
      });
    }
  };
  
  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    github: '',
    website: '',
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine the target user ID for profile loading
  const targetUserId = (() => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      return currentUser?.id;
    }
    return userId;
  })();
  
  const isOwnProfile = currentUser?.id === targetUserId;

  // Debug logging
  console.log('🔍 Profile component render:', {
    userId,
    currentUserId: currentUser?.id,
    isAuthenticated,
    authLoading,
    isLoading,
    pathname: window.location.pathname,
    user: user ? 'exists' : 'null',
    targetUserId: targetUserId,
    isOwnProfile
  });

  // Handle redirects - simplified logic
  useEffect(() => {
    console.log('🔄 Redirect effect triggered:', {
      authLoading,
      isAuthenticated,
      userId,
      currentUserId: currentUser?.id,
      pathname: window.location.pathname
    });
    
    // Don't do anything while auth is loading
    if (authLoading) {
      console.log('⏳ Auth loading, skipping redirects');
      return;
    }
    
    // If not authenticated, let ProtectedRoute handle it
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, skipping redirects');
      return;
    }
    
    // If no current user yet, wait (don't redirect away)
    if (!currentUser?.id) {
      console.log('⏳ No current user yet, waiting without redirect');
      return;
    }
    
    // Handle /profile route (no userId) - only redirect once
    if (!userId && window.location.pathname === '/profile') {
      console.log('🔄 Redirecting from /profile to current user profile');
      navigate(`/profile/${currentUser.id}`, { replace: true });
      return;
    }
    
    // Handle invalid userIds - only redirect once
    if ((userId === 'undefined' || userId === 'null') && currentUser?.id) {
      console.log('🔄 Invalid userId detected, redirecting to current user profile');
      navigate(`/profile/${currentUser.id}`, { replace: true });
      return;
    }
    
    console.log('✅ No redirect needed');
  }, [userId, currentUser?.id, isAuthenticated, authLoading, navigate]);

  // Load profile data - simplified logic
  useEffect(() => {
    const loadProfile = async () => {
      console.log('🚀 loadProfile called with:', {
        authLoading,
        isAuthenticated,
        targetUserId,
        userId,
        currentUserId: currentUser?.id
      });
      
      // Don't load if auth is still loading
      if (authLoading) {
        console.log('⏳ Auth still loading, skipping profile load');
        return;
      }
      
      // Don't load if not authenticated
      if (!isAuthenticated) {
        console.log('❌ Not authenticated, skipping profile load');
        return;
      }
      
      // Don't load if no target user ID
      if (!targetUserId) {
        console.log('❌ No targetUserId available, skipping profile load');
        setIsLoading(false);
        return;
      }
      
      // Don't load if we're in a redirect scenario
      if (userId === 'undefined' || userId === 'null') {
        console.log('🔄 In redirect scenario, skipping profile load');
        return;
      }
      
      // Don't load if we're on /profile without userId (will redirect)
      if (!userId && window.location.pathname === '/profile') {
        console.log('🔄 On /profile without userId, skipping profile load (will redirect)');
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Loading profile for userId:', targetUserId);
        
        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          console.log('Profile load timeout, stopping loading');
          setIsLoading(false);
        }, 10000); // 10 second timeout
        setLoadTimeout(timeout);
        
        setIsLoadingFollowers(true);
        setIsLoadingFollowing(true);
        
        const [profileData, userProjects, followData] = await Promise.all([
          userService.getUserProfile(targetUserId),
          projectsService.getUserProjects(targetUserId),
          userService.getFollowData(targetUserId),
        ]);
        
        setIsLoadingFollowers(false);
        setIsLoadingFollowing(false);
        
        // Clear timeout if successful
        if (loadTimeout) {
          clearTimeout(loadTimeout);
          setLoadTimeout(null);
        }
        
        console.log('✅ Profile data loaded successfully:', profileData);
        console.log('✅ User projects loaded:', userProjects);
        setUser(profileData);
        setProjects(userProjects);
        setIsFollowing(profileData.isFollowing || false);
        setFollowerCount(profileData.followersCount || 0);
        setFollowingCount(profileData.followingCount || 0);
        setFollowers(followData.followers || []);
        setFollowing(followData.following || []);
        setIsFollowing(profileData.isFollowing || false);
        
        // Update page title
        document.title = `${profileData.username} - DevConnect`;
        console.log('✅ Profile state updated, user:', profileData.username);
        
      } catch (error) {
        console.error('Error loading profile:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        toast({
          title: 'Failed to load profile',
          description: error.response?.data?.msg || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      } finally {
        // Clear timeout if it exists
        if (loadTimeout) {
          clearTimeout(loadTimeout);
          setLoadTimeout(null);
        }
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [targetUserId, isAuthenticated, authLoading, userId, toast]);

  // Fallback: If we have a valid userId but no user data after 3 seconds, try to load again
  useEffect(() => {
    if (userId && !user && !isLoading && isAuthenticated && !authLoading) {
      const fallbackTimer = setTimeout(() => {
        console.log('🔄 Fallback: Attempting to reload profile data');
        if (targetUserId) {
          userService.getUserProfile(targetUserId)
            .then(profileData => {
              console.log('✅ Fallback: Profile data loaded:', profileData);
              setUser(profileData);
              document.title = `${profileData.username} - DevConnect`;
            })
            .catch(error => {
              console.error('❌ Fallback: Failed to load profile:', error);
            });
        }
      }, 3000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [userId, user, isLoading, isAuthenticated, authLoading, targetUserId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };
  }, [loadTimeout]);

  const handleFollowToggle = async () => {
    if (!userId || !user) return;
    
    try {
      if (isFollowing) {
        await userService.unfollowUser(userId);
        setIsFollowing(false);
        setUser(prev => prev ? { ...prev, followersCount: (prev.followersCount || 0) - 1 } : null);
      } else {
        await userService.followUser(userId);
        setIsFollowing(true);
        setUser(prev => prev ? { ...prev, followersCount: (prev.followersCount || 0) + 1 } : null);
      }
    } catch (error) {
      toast({
        title: 'Failed to update follow status',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Edit profile functions
  const startEditing = () => {
    if (!user) return;
    setEditForm({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      github: user.github || '',
      website: user.website || '',
      skills: user.skills || [],
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({
      username: '',
      email: '',
      bio: '',
      location: '',
      github: '',
      website: '',
      skills: [],
    });
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setIsUploading(true);
      const updatedUser = await userService.updateProfile({
        username: editForm.username,
        email: editForm.email,
        bio: editForm.bio,
        location: editForm.location,
        github: editForm.github,
        website: editForm.website,
        skills: editForm.skills,
      });
      
      // Only update if we got a valid user object back
      if (updatedUser && updatedUser.id) {
        setUser(updatedUser);
        updateUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error('Invalid user data received from update:', updatedUser);
        throw new Error('Invalid user data received');
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfilePicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log('Uploading profile picture for user:', currentUser?.id);
      
      const updatedUser = await userService.updateProfile({
        profilePic: file,
      });
      
      console.log('Profile picture upload successful:', updatedUser);
      
      // Only update if we got a valid user object back
      if (updatedUser && updatedUser.id) {
        setUser(updatedUser);
        updateUser(updatedUser);
      } else {
        console.error('Invalid user data received from upload:', updatedUser);
        throw new Error('Invalid user data received');
      }
      
      toast({
        title: 'Profile picture updated',
        description: 'Your profile picture has been updated successfully.',
      });
    } catch (error) {
      console.error('Profile picture upload error:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      toast({
        title: 'Failed to update profile picture',
        description: error.response?.data?.msg || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      
      // Don't clear the user data on error - keep the existing profile
      console.log('Keeping existing user data after upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  // Show loading state while auth is loading or profile is loading
  if (authLoading || isLoading) {
    console.log('🔄 Rendering loading state:', { authLoading, isLoading });
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {authLoading ? 'Loading...' : 'Loading profile...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, don't render anything (ProtectedRoute should handle redirect)
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, returning null');
    return null;
  }

  if (!user && !isLoading) {
    console.log('❌ No user data and not loading, showing user not found');
    return (
      <Layout>
        <div className="text-center py-16 space-y-4">
          <h3 className="text-xl font-semibold">User not found</h3>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
          <div className="space-x-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
            <Button 
              onClick={() => {
                console.log('🔄 Manual profile reload triggered');
                if (targetUserId) {
                  setIsLoading(true);
                  userService.getUserProfile(targetUserId)
                    .then(profileData => {
                      console.log('✅ Manual reload: Profile data loaded:', profileData);
                      setUser(profileData);
                      setIsLoading(false);
                    })
                    .catch(error => {
                      console.error('❌ Manual reload: Failed to load profile:', error);
                      setIsLoading(false);
                    });
                }
              }} 
              variant="default"
            >
              Try Again
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Debug info: userId={userId}, targetUserId={targetUserId}, isAuthenticated={isAuthenticated ? 'true' : 'false'}
          </div>
        </div>
      </Layout>
    );
  }

  console.log('✅ Rendering profile for user:', user?.username);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-hero border-primary/10">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={user.profilePicUrl || user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                      {user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}>
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={editForm.username}
                            onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="Username"
                            className="text-2xl font-bold"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    ) : (
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h1 className="text-3xl font-bold">{user.username}</h1>
                        <p className="text-muted-foreground mt-1">{user.email}</p>
                        {user.bio && (
                          <p className="text-lg text-muted-foreground mt-2">{user.bio}</p>
                        )}
                      </div>
                      {!isOwnProfile && (
                        <div>
                          {isFollowing ? (
                            <Button
                              onClick={handleUnfollow}
                              variant="outline"
                              className="space-x-2"
                            >
                              <UserMinus className="h-4 w-4" />
                              <span>Unfollow</span>
                            </Button>
                          ) : (
                            <Button
                              onClick={handleFollow}
                              variant="default"
                              className="space-x-2 bg-gradient-primary hover:opacity-90"
                            >
                              <UserPlus className="h-4 w-4" />
                              <span>Follow</span>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                  
                  {/* Followers/Following Stats */}
                  <div className="flex items-center my-4">
                    <FollowList
                      type="followers"
                      count={followerCount}
                      users={followers}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                      isLoading={isLoadingFollowers}
                    />
                    <FollowList
                      type="following"
                      count={followingCount}
                      users={following}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                      isLoading={isLoadingFollowing}
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {isEditing ? (
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <Input
                            value={editForm.location}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Location"
                            className="w-32"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4" />
                          <Input
                            value={editForm.website}
                            onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="Website"
                            className="w-32"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Github className="h-4 w-4" />
                          <Input
                            value={editForm.github}
                            onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))}
                            placeholder="GitHub username"
                            className="w-32"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        {user.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        {user.website && (
                          <div className="flex items-center space-x-1">
                            <LinkIcon className="h-4 w-4" />
                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              Website
                            </a>
                          </div>
                        )}
                        {user.github && (
                          <div className="flex items-center space-x-1">
                            <Github className="h-4 w-4" />
                            <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              GitHub
                            </a>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined DevConnect</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Skills */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editForm.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <X 
                              className="h-3 w-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeSkill(skill)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button onClick={addSkill} size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    user.skills && user.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )
                  )}
                  
                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="font-semibold">{user.followersCount || 0}</span>
                      <span className="text-muted-foreground ml-1">followers</span>
                    </div>
                    <div>
                      <span className="font-semibold">{user.followingCount || 0}</span>
                      <span className="text-muted-foreground ml-1">following</span>
                    </div>
                    <div>
                      <span className="font-semibold">{projects.length}</span>
                      <span className="text-muted-foreground ml-1">projects</span>
                    </div>
                    {user.createdAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-muted-foreground">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  {isOwnProfile ? (
                    isEditing ? (
                      <div className="flex space-x-2">
                        <Button
                          onClick={saveProfile}
                          disabled={isUploading}
                          size="sm"
                          className="bg-gradient-primary hover:opacity-90"
                        >
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          variant="outline"
                          size="sm"
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={startEditing}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={handleFollowToggle}
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                      className={!isFollowing ? "bg-gradient-primary hover:opacity-90" : ""}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed User Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-panel/30 border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Profile Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                      <p className="text-sm">{user.username}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p className="text-sm">{user.location || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                      <p className="text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links & Skills */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Social & Skills</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">GitHub</Label>
                      {user.github ? (
                        <a 
                          href={`https://github.com/${user.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          github.com/{user.github}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                      {user.website ? (
                        <a 
                          href={user.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {user.website}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Skills</Label>
                      {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills added</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Content */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <h3 className="text-xl font-semibold">No projects yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? "Share your first project with the community!" : `${user.username} hasn't shared any projects yet.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-panel/30 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
                      <CardHeader>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.techStack.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.techStack.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="followers">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Followers list coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="following">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Following list coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}