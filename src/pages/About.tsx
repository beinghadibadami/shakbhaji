
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="circle-blur bg-primary/20 top-0 left-1/3 transform -translate-x-1/2"></div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Leaf className="mr-1 h-4 w-4" />
                <span>Our Mission</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                About VegVision
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                We're on a mission to revolutionize how people understand the quality of the produce they consume. Using advanced AI technology, we provide accurate analysis of fruits and vegetables to help customers make better choices.
              </p>
            </div>
          </div>
        </section>
        
        {/* About Content */}
        <section className="py-12 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="mb-4 text-muted-foreground">
                  VegVision started with a simple observation: people often struggle to determine the quality of fruits and vegetables they purchase. Our founder, a computer vision expert and avid cook, decided to leverage AI to solve this everyday problem.
                </p>
                <p className="mb-4 text-muted-foreground">
                  Since our inception in 2023, we've been refining our algorithms to provide the most accurate analysis of produce quality, moisture content, and market value.
                </p>
                <p className="text-muted-foreground">
                  Today, VegVision serves thousands of users daily, from home cooks to professional chefs and even agricultural businesses who rely on our technology for quality control.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Our Technology</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">Advanced computer vision trained on thousands of produce samples</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">Real-time market price integration from major retailers</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">Continuous learning algorithms that improve with each analysis</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">Instant quality assessments within seconds of uploading an image</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're a dedicated team of AI engineers, food scientists, and user experience experts working together to bring you the best produce analysis tool.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Team Member Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30"></div>
                </div>
                <h3 className="text-xl font-semibold">Jane Doe</h3>
                <p className="text-sm text-muted-foreground mb-3">Founder & CEO</p>
                <p className="text-sm text-muted-foreground">
                  Computer vision expert with 10+ years of experience in AI and machine learning.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30"></div>
                </div>
                <h3 className="text-xl font-semibold">John Smith</h3>
                <p className="text-sm text-muted-foreground mb-3">Lead Developer</p>
                <p className="text-sm text-muted-foreground">
                  Full-stack developer specialized in AI integration and optimization.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30"></div>
                </div>
                <h3 className="text-xl font-semibold">Maria Garcia</h3>
                <p className="text-sm text-muted-foreground mb-3">Food Scientist</p>
                <p className="text-sm text-muted-foreground">
                  Ph.D. in Food Science with expertise in produce quality assessment.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/">
                <Button>
                  <span>Back to Analyzer</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
