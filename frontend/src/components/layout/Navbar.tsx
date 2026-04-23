import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Folder,
  MessageCircle,
  User,
  Users,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Rss
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Feed', href: '/feed', icon: Rss },
  { name: 'Projects', href: '/projects', icon: Folder },
  // { name: 'Network', href: '/UserSearch', icon: Users },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
];

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:bg-primary/30 transition-all">
                <span className="text-primary font-black text-lg">VC</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter uppercase text-foreground">
                  Dev<span className="text-primary">Connect</span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Visible Network</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Minimalist */}
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { name: 'Feed', href: '/feed', icon: Rss },
              { name: 'Projects', href: '/projects', icon: Folder },
              // { name: 'Network', href: '/UserSearch', icon: Users },
              { name: 'Messages', href: '/messages', icon: MessageCircle },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 hover:text-primary transition-colors flex items-center space-x-2"
              >
                <item.icon className="h-3 w-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 transition-all text-muted-foreground hover:text-primary"
            >
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10 border border-transparent hover:border-primary/30">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.profilePicUrl || user?.avatar} alt={user?.username} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {user?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background border-border" align="end">
                  <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary">
                    <Link to={`/profile/${user?.id}`} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="sm" className="bg-primary text-background font-bold text-[10px] uppercase tracking-widest px-6 py-5 rounded-md shadow-[0_0_20px_rgba(255,100,0,0.2)] hover:shadow-[0_0_30px_rgba(255,100,0,0.4)] transition-all">
                  <Link to="/register">Get Started</Link>
                </Button>
              </motion.div>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-background border-b border-border p-6"
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};