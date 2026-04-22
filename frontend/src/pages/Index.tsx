import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, 
  Users, 
  MessageCircle, 
  Folder, 
  Heart, 
  Star, 
  GitBranch,
  Zap,
  Shield,
  Globe,
  Sun,
  Moon,
  Rss,
  User
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Code,
    title: 'Share Your Code',
    description: 'Showcase your projects, get feedback, and discover innovative solutions from the developer community.',
  },
  {
    icon: Users,
    title: 'Connect with Developers',
    description: 'Build meaningful connections with like-minded developers, mentors, and potential collaborators.',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Messaging',
    description: 'Communicate instantly with other developers through our integrated chat system.',
  },
  {
    icon: Folder,
    title: 'Project Management',
    description: 'Organize and showcase your projects with detailed descriptions, tech stacks, and live demos.',
  },
  {
    icon: Heart,
    title: 'Like & Follow',
    description: 'Show appreciation for great work and follow developers whose content inspires you.',
  },
  {
    icon: Star,
    title: 'Discover Talent',
    description: 'Find skilled developers for collaboration, hiring, or mentorship opportunities.',
  },
];

const stats = [
  { label: 'Active Developers', value: '10K+' },
  { label: 'Projects Shared', value: '25K+' },
  { label: 'Connections Made', value: '50K+' },
  { label: 'Messages Sent', value: '100K+' },
];

export default function Index() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="bg-background/20 backdrop-blur-sm border border-border/20 hover:bg-background/30"
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'dark' ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {theme === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.div>
        </Button>
      </div>

      {/* Hero Section - Golden Ratio Split */}
      <section className="container mx-auto px-6 pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Heading & Content (7 Columns - ~60%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-left z-10"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest mb-12">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Full-Stack Social Platform</span>
            </div>
            
            {/* Massive Heading - Golden Ratio Sizing */}
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black mb-10 leading-[0.85] tracking-tighter uppercase">
              Connect. <span className="text-primary">Code.</span><br />
              Share &<br />
              <span className="text-primary">Collaborate</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed opacity-80">
              The ultimate hub for developers to showcase projects, build meaningful connections, 
              and communicate in real-time. Powering the next generation of software creators.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 mb-16">
              {[
                { icon: Rocket, label: 'Showcase Projects' },
                { icon: MessageCircle, label: 'Real-time Chat' },
                { icon: Github, label: 'GitHub Integrated' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 px-4 py-2 rounded-lg border border-white/5 bg-white/5 text-[11px] font-bold uppercase tracking-wide text-foreground/70 active:scale-95 transition-transform cursor-pointer hover:bg-white/10">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-20">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="lg" className="bg-primary text-background hover:bg-primary/90 font-black px-10 py-8 rounded-xl text-lg transition-all group">
                  <Link to="/register" className="flex items-center">
                    Join the Network <Zap className="ml-3 h-5 w-5 fill-current group-hover:scale-125 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" size="lg" className="border-white/10 bg-white/5 backdrop-blur-md text-foreground font-black px-10 py-8 rounded-xl text-lg hover:bg-white/10">
                  <Link to="/login">Sign In</Link>
                </Button>
              </motion.div>
            </div>

            {/* Bottom Stats Row */}
            <div className="flex gap-16 items-center">
              {[
                { value: '10K+', label: 'Developers' },
                { value: '25K+', label: 'Projects' },
                { value: '100K+', label: 'Interactions' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-primary italic leading-none">{stat.value}</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Interactive Elements (5 Columns - ~40%) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Main Visualizer Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full bg-card/40 border border-white/5 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-red-500/50" />
                   <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                   <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Architecture_Graph.v3</span>
              </div>

              {/* Node Graph Mockup */}
              <div className="relative h-[350px] w-full flex items-center justify-center">
                {/* SVG Connections with animation */}
                <svg className="absolute inset-0 w-full h-full">
                  <motion.line 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    x1="20%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-primary/30" 
                  />
                  <motion.line x1="80%" y1="30%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
                  <motion.line x1="50%" y1="50%" x2="35%" y2="80%" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
                  <motion.line x1="50%" y1="50%" x2="75%" y2="75%" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
                </svg>

                {/* Nodes */}
                {[
                  { pos: 'top-10 left-5', label: 'ingress-controller' },
                  { pos: 'top-20 right-5', label: 'db:vector', active: true },
                  { pos: 'bottom-10 left-10', label: 'auth-service' },
                  { pos: 'bottom-20 right-10', label: 'cache:redis' },
                  { pos: 'top-[45%] left-[42%]', label: 'core-engine', master: true }
                ].map((node, i) => (
                  <motion.div
                    key={node.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    whileHover={{ scale: 1.1, zIndex: 50 }}
                    className={`absolute ${node.pos} px-4 py-2 rounded-xl border text-[9px] font-black tracking-wider uppercase flex items-center space-x-3 cursor-pointer transition-all
                      ${node.active ? 'border-primary bg-primary/20 text-primary shadow-[0_0_20px_rgba(0,255,238,0.3)]' : 'border-white/10 bg-background/80 text-foreground/80'}
                      ${node.master ? 'border-primary/50 ring-4 ring-primary/10 shadow-[0_0_30px_rgba(0,255,238,0.2)]' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${node.active || node.master ? 'bg-primary shadow-[0_0_10px_rgba(0,255,238,1)]' : 'bg-muted-foreground/30'}`} />
                    <span>{node.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Overlapping Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-8 -right-8 w-72 bg-background border-2 border-primary/20 rounded-3xl p-8 shadow-strong z-20"
            >
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-2xl font-black uppercase italic leading-none">Architect</h4>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1">Network Node v2</p>
                  </div>
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                     <Star className="h-5 w-5 text-primary" />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Stability</span>
                     <span className="text-xs font-black text-primary">99.98%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '99%' }} 
                        transition={{ duration: 1 }}
                        className="h-full bg-primary" 
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                     <div className="flex-1 text-center py-2 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] font-bold text-muted-foreground">LVL</div>
                        <div className="text-xl font-black">12</div>
                     </div>
                     <div className="flex-1 text-center py-2 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] font-bold text-muted-foreground">NODE</div>
                         <div className="text-xl font-black text-primary">#154</div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Choose DevConnect?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to grow your developer network and showcase your skills
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 shadow-soft hover:shadow-strong">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Built with Modern Technology</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            DevConnect is built using cutting-edge technologies to ensure the best user experience
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-20">
          {[
            'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 
            'Socket.io', 'JWT Auth', 'REST API', 'Real-time Chat'
          ].map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border border-primary/20">
                {tech}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Animated Component Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Project Cards', icon: Folder, color: 'bg-blue-500' },
            { title: 'Real-time Chat', icon: MessageCircle, color: 'bg-green-500' },
            { title: 'Social Feed', icon: Rss, color: 'bg-purple-500' },
            { title: 'User Profiles', icon: User, color: 'bg-rose-500' },
          ].map((comp, idx) => (
            <motion.div
              key={comp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <div className="p-1 rounded-2xl bg-gradient-to-br from-border/50 to-transparent hover:from-primary/20 transition-all duration-500">
                <div className="bg-card rounded-xl p-6 border border-border shadow-soft group-hover:shadow-strong transition-all overflow-hidden relative">
                  <div className={`h-12 w-12 rounded-lg ${comp.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <comp.icon className={`h-6 w-6 ${comp.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="font-bold mb-2">{comp.title}</h3>
                  <div className="space-y-2 opacity-50">
                    <div className="h-1.5 w-full bg-muted rounded-full" />
                    <div className="h-1.5 w-2/3 bg-muted rounded-full" />
                  </div>
                  {/* Animative "Loading" line */}
                  <motion.div 
                    animate={{ x: [-100, 200] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-0.5 w-20 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Your data is protected with enterprise-grade security and privacy controls.',
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Optimized performance ensures smooth and responsive user experience.',
            },
            {
              icon: Globe,
              title: 'Global Community',
              description: 'Connect with developers from around the world, 24/7.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-primary border-0 text-primary-foreground shadow-strong">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">Ready to Connect?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Join thousands of developers who are already building their network on DevConnect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90 shadow-soft text-lg px-8 py-6"
                >
                  <Link to="/register">Start Your Journey</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/20">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 DevConnect. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}
