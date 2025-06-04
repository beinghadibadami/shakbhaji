
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6">404</h1>
            <h2 className="text-2xl font-medium mb-3">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't seem to exist or may have been moved.
            </p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
