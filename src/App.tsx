import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { Analytics } from "@vercel/analytics/react";

import Index from "./pages/Index";
import News from "./pages/News";
import MiniReports from "./pages/MiniReports";
import Discussions from "./pages/Discussions";
import Resources from "./pages/Resources";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import NewsPost from "./pages/NewsPost";
import MiniReportPost from "./pages/MiniReportPost";
import DiscussionPost from "./pages/DiscussionPost";
import Research from "./pages/Research";
import Search from "./pages/Search";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsPost />} />
                <Route path="/mini-reports" element={<MiniReports />} />
                <Route path="/mini-reports/:id" element={<MiniReportPost />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/discussions/:id" element={<DiscussionPost />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/about" element={<About />} />
                <Route path="/research" element={<Research />} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="py-6 border-t border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-sm text-center text-muted-foreground">
                  © {new Date().getFullYear()} Chicago Cyber Threat Intelligence Community. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
