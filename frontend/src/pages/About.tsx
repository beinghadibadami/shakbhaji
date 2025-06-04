
import React from 'react';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, Sparkles, Apple, CheckCircle2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="circle-blur bg-primary/20 top-0 left-1/3 transform -translate-x-1/2"></div>
          <div className="circle-blur bg-secondary/20 bottom-0 right-1/3 transform translate-x-1/2"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="mr-1 h-4 w-4" />
                <span>Our Mission</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                About <span className="text-primary">VegVision</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                We're on a mission to revolutionize how people understand the quality of the produce they consume. Using advanced AI technology, we provide accurate analysis of fruits and vegetables to help customers make better choices.
              </p>
            </div>
          </div>
        </section>
        
        {/* About Content */}
        <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-background">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 md:order-1">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/20 rounded-full"></div>
                
                <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden border border-primary/10 transform -rotate-2 transition-transform hover:rotate-0 duration-500">
                  <div className="bg-white p-8">
                    <div className="flex items-center mb-6">
                      <div className="rounded-full bg-primary/10 p-2 mr-3">
                        <Apple className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Our Mission Statement</h3>
                    </div>
                    
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">Democratize access to professional-grade produce analysis</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">Reduce food waste through better consumer education</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">Support sustainable farming with AI-powered insights</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">Make healthy eating more accessible and affordable</p>
                      </li>
                    </ul>
                    
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-muted flex items-center gap-3">
                      <Heart className="h-5 w-5 text-accent" />
                      <p className="text-sm">Built with passion for a healthier, more sustainable world.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="mb-4 text-muted-foreground">
                  VegVision started with a simple observation: people often struggle to determine the quality of fruits and vegetables they purchase. Our founder, a computer vision expert and avid cook, decided to leverage AI to solve this everyday problem.
                </p>
                <p className="mb-4 text-muted-foreground">
                  Since our inception in 2023, we've been refining our algorithms to provide the most accurate analysis of produce quality, moisture content, and market value.
                </p>
                <p className="text-muted-foreground mb-8">
                  Today, VegVision serves thousands of users daily, from home cooks to professional chefs and even agricultural businesses who rely on our technology for quality control.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="h-6 w-6 text-primary">🥑</div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Accurate Analysis</h4>
                      <p className="text-sm text-muted-foreground">97% accuracy in quality assessment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="h-6 w-6 text-secondary">🍎</div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Diverse Recognition</h4>
                      <p className="text-sm text-muted-foreground">Identifies 200+ varieties of produce</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="h-6 w-6 text-accent">🔍</div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Detailed Insights</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive reports with actionable data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Heart className="mr-1 h-4 w-4" />
                <span>Our Team</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Experts</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're a dedicated team of AI engineers, food scientists, and user experience experts working together to bring you the best produce analysis tool.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Team Member Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-primary/5 transform hover:-translate-y-1 duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center">
                  <span className="text-2xl">👩🏻‍💻</span>
                </div>
                <h3 className="text-xl font-semibold text-center">Jane Doe</h3>
                <p className="text-sm text-primary text-center mb-3">Founder & CEO</p>
                <p className="text-sm text-muted-foreground text-center">
                  Computer vision expert with 10+ years of experience in AI and machine learning.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-primary/5 transform hover:-translate-y-1 duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center">
                  <span className="text-2xl">👨🏽‍💻</span>
                </div>
                <h3 className="text-xl font-semibold text-center">John Smith</h3>
                <p className="text-sm text-primary text-center mb-3">Lead Developer</p>
                <p className="text-sm text-muted-foreground text-center">
                  Full-stack developer specialized in AI integration and optimization.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-primary/5 transform hover:-translate-y-1 duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center">
                  <span className="text-2xl">👩🏾‍🔬</span>
                </div>
                <h3 className="text-xl font-semibold text-center">Maria Garcia</h3>
                <p className="text-sm text-primary text-center mb-3">Food Scientist</p>
                <p className="text-sm text-muted-foreground text-center">
                  Ph.D. in Food Science with expertise in produce quality assessment.
                </p>
              </div>
            </div>
            
            <div className="mt-14 text-center">
              <Link to="/">
                <Button size="lg" className="rounded-full text-base px-8 shadow-lg shadow-primary/20">
                  <span>Try VegVision Now</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
