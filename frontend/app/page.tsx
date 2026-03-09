"use client";
import React, { useState, useEffect } from "react";
import Ticker from "./components/Ticker";
import HeroSection from "./components/HeroSection";
import NewsCard from "./components/NewsCard";

export default function Home() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNewsItems(data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans antialiased selection:bg-accent-blue selection:text-white pb-24">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b border-[var(--border-color)]">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-accent-blue to-accent-green inline-block"></span>
            Future Vision
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
            <a href="#" className="hover:text-white transition-colors">Markets</a>
            <a href="#" className="hover:text-white transition-colors">Blockchain</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
            <a href="#" className="hover:text-white transition-colors">Policy</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-white transition-colors text-[var(--text-muted)] hidden md:block">
              Sign In
            </button>
            <button className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Live Market Ticker */}
      <Ticker />

      <main>
        {/* Featured Hero Area */}
        <HeroSection />

        {/* News Grid Area */}
        <section className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Intelligence</h2>
            <a href="#" className="text-sm font-medium text-accent-blue hover:text-white transition-colors flex items-center gap-2">
              View All <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-12 text-[var(--text-muted)]">Aggregating and summarizing latest news...</div>
            ) : newsItems.length > 0 ? (
              newsItems.map((news, index) => (
                <NewsCard
                  key={index}
                  category={news.category}
                  title={news.title}
                  summary={news.summary}
                  url={news.url}
                  image={news.image}
                  source={news.source}
                  delay={news.delay}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-[var(--text-muted)]">No news available at the moment.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
