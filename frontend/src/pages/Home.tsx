import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Users, 
  MessageSquare, 
  Rocket, 
  Github, 
  ExternalLink, 
  Zap, 
  Globe, 
  Shield, 
  Star, 
  GitBranch 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-24 pb-20">
        {/* Dashboard Hero - Golden Ratio Split */}
        <section className="relative overflow-hidden pt-12 pb-20 min-h-[70vh] flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                {/* Left Column: Welcome & Stats (7 Columns) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 text-left z-10"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest mb-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span>System status: Operational</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.85] tracking-tighter uppercase italic">
                        Welcome back,<br />
                        <span className="text-primary">{user?.username || 'Developer'}</span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed opacity-80">
                        The community missed you. You have <span className="text-foreground font-bold">12 new notifications</span> and 
                        <span className="text-foreground font-bold"> 3 unread messages</span> in your inbox. Ready to start your next project?
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button asChild size="lg" className="bg-primary text-background hover:bg-primary/90 font-black px-10 py-8 rounded-xl text-lg transition-all">
                                <Link to="/feed">
                                    Explore Feed <Rocket className="ml-3 h-5 w-5 fill-current" />
                                </Link>
                            </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button asChild variant="outline" size="lg" className="border-white/10 bg-white/5 backdrop-blur-md text-foreground font-black px-10 py-8 rounded-xl text-lg hover:bg-white/10">
                                <Link to={`/profile/${user?.id}`}>Your Statistics</Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/5">
                        {[
                            { value: '5', label: 'My Projects' },
                            { value: '142', label: 'Followers' },
                            { value: '28', label: 'Posts' }
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl font-black text-primary italic leading-none">{stat.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Dynamic Architecture (5 Columns) */}
                <div className="lg:col-span-5 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card/40 border border-white/5 backdrop-blur-3xl rounded-3xl p-8 shadow-strong"
                    >
                        <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Network Pulse</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-[9px] font-bold text-primary italic uppercase">Live Feed</span>
                                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                            </div>
                        </div>

                        <div className="relative h-[300px] w-full flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full opacity-20">
                                <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="currentColor" strokeWidth="1" />
                                <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="currentColor" strokeWidth="1" />
                                <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="currentColor" strokeWidth="1" />
                            </svg>

                            <div className="p-10 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center animate-pulse-slow">
                                <Rocket className="h-12 w-12 text-primary" />
                            </div>

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-0 right-4 p-3 bg-background border border-white/10 rounded-xl flex items-center space-x-2"
                            >
                                <Users className="h-4 w-4 text-primary" />
                                <span className="text-[8px] font-bold">+4</span>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute bottom-4 left-4 p-3 bg-background border border-white/10 rounded-xl flex items-center space-x-2"
                            >
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span className="text-[8px] font-bold">New</span>
                            </motion.div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Profile Completion</span>
                            <span className="text-sm font-black text-primary">85%</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Features Section - Re-themed */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { icon: Rocket, title: 'Project Showcase', desc: 'Display your work with tech stacks and live links.' },
                { icon: MessageSquare, title: 'Instant Chat', desc: 'Connect with developers in real-time via Socket.IO.' },
                { icon: Star, title: 'Reputation', desc: 'Gain likes, follows, and grow your community rank.' },
                { icon: Github, title: 'GitHub Sync', desc: 'Import and showcase your repositories seamlessly.' },
            ].map((f, i) => (
                <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="h-full bg-white/5 border-white/5 hover:bg-white/10 transition-all group overflow-hidden">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <f.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg uppercase font-black tracking-tighter">{f.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-sm text-muted-foreground">{f.desc}</CardDescription>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </section>
      </div>
    </Layout>
  );
}