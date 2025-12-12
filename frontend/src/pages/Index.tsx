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
  Moon
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-8 shadow-strong">
            <span className="text-primary-foreground font-bold text-2xl">DC</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              DevConnect
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The ultimate platform for developers to connect, collaborate, and showcase their work. 
            Join a thriving community of passionate developers from around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 shadow-strong text-lg px-8 py-6"
              >
                <Link to="/register">Get Started Free</Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 text-lg px-8 py-6 bg-background/20 backdrop-blur-sm hover:bg-background/30"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
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
