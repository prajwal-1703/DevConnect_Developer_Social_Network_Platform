import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Users, MessageSquare, Rocket, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';

const features = [
  {
    icon: Code,
    title: 'Share Code',
    description: 'Share code snippets, get feedback, and collaborate with fellow developers.',
  },
  {
    icon: Rocket,
    title: 'Showcase Projects',
    description: 'Display your projects, get discovered, and inspire others with your work.',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Connect instantly with developers through our real-time messaging system.',
  },
  {
    icon: Users,
    title: 'Build Network',
    description: 'Follow developers, build your network, and grow your professional circle.',
  },
];

export default function Home() {
  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Connect. Code. Create.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The social platform built for developers. Share your projects, connect with peers,
              and build the future together.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-soft">
              <Link to="/feed">
                <Rocket className="mr-2 h-5 w-5" />
                Explore Feed
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary/20">
              <Link to="/projects">
                <Github className="mr-2 h-5 w-5" />
                Browse Projects
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to grow as a developer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers sharing knowledge, building projects, and advancing their careers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="h-full bg-panel/50 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-soft">
                  <CardHeader className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-accent rounded-2xl">
          <div className="text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-accent-foreground"
            >
              Join the growing community
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { number: '10K+', label: 'Developers' },
                { number: '25K+', label: 'Projects Shared' },
                { number: '100K+', label: 'Code Snippets' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-accent-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="text-accent-foreground/80 text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to level up your development journey?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start sharing your projects, connect with like-minded developers, and accelerate your growth.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 shadow-soft">
              <Link to="/register">
                Get Started Today
                <ExternalLink className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
}