"use client";
import React, { useState, useEffect } from "react";
import Ticker from "./components/Ticker";
import HeroSection from "./components/HeroSection";
import NewsCard from "./components/NewsCard";

const CATEGORIES = ["All", "Crypto", "Markets", "Policy", "Startups", "AI"];

export default function Home() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

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

  const featuredNews = newsItems.length > 0 ? newsItems[0] : null;
  const importantNews = newsItems.length > 1 ? newsItems.slice(1, 3) : [];
  const remainingNews = newsItems.length > 3 ? newsItems.slice(3) : [];

  const filteredNews = activeCategory === "All"
    ? remainingNews
    : remainingNews.filter(item => {
      if (!item.category) return false;
      return item.category.toLowerCase().includes(activeCategory.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans antialiased selection:bg-accent-blue selection:text-white pb-24">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b border-[var(--border-color)]">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-gradient-to-br from-accent-blue to-accent-green inline-block shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
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
            <button className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {/* Live Market Ticker */}
      <Ticker />

      <main className="container mx-auto px-6 lg:px-12 pt-10">
        {/* Featured Hero Area */}
        {loading ? (
          <div className="w-full h-[500px] rounded-2xl bg-[var(--panel-bg)] animate-pulse mb-12 border border-[var(--border-color)] flex items-center justify-center">
            <span className="text-[var(--text-muted)] text-sm font-semibold tracking-wider uppercase">Loading Intelligence...</span>
          </div>
        ) : (
          <HeroSection featuredNews={featuredNews} importantNews={importantNews} />
        )}

        {/* Dashboard Layout */}
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar border-b border-[var(--border-color)]">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                      ? "bg-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-accent-blue/50"
                      : "bg-[var(--panel-bg)] text-[var(--text-muted)] hover:text-white hover:bg-white/5 border border-[var(--border-color)]"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Latest Intelligence</h2>
              <a href="#" className="text-sm font-medium text-accent-blue hover:text-white transition-colors flex items-center gap-2 group">
                View All <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
              </a>
            </div>

            {/* News Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] h-96 animate-pulse p-5">
                    <div className="h-48 bg-gray-800 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-800 rounded w-full mb-2"></div>
                    <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-800 rounded w-full mb-2 mt-auto"></div>
                    <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                  </div>
                ))
              ) : filteredNews.length > 0 ? (
                filteredNews.map((news, index) => (
                  <NewsCard
                    key={index}
                    category={news.category}
                    title={news.title}
                    summary={news.summary}
                    url={news.url}
                    image={news.image}
                    source={news.source}
                    delay={0.1 * (index % 6)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-[var(--text-muted)]">
                  No matching intelligence found for "{activeCategory}".
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Trending */}
          <aside className="w-full xl:w-80 flex-shrink-0">
            <div className="glass-panel rounded-2xl p-6 sticky top-24 border border-[var(--border-color)] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-4">
                <div className="w-2 h-2 rounded-full bg-accent-purple shadow-[0_0_8px_rgba(139,92,246,0.8)] animate-pulse"></div>
                <h3 className="text-lg font-bold uppercase tracking-wide">Trending</h3>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Institutional flows into spot Bitcoin ETFs hit new all-time high.", source: "Research", views: "14.2k" },
                  { title: "AI agents executing on-chain trades: The next frontier of DeFi.", source: "Opinion", views: "12.8k" },
                  { title: "SEC expected to rule on Ethereum staking products by next quarter.", source: "Policy", views: "9.5k" },
                  { title: "Tokenized real-world assets surpass $5B in TVL.", source: "Markets", views: "8.1k" },
                ].map((item, idx) => (
                  <a key={idx} href="#" className="block group border-b border-[var(--border-color)] pb-6 last:border-0 last:pb-0">
                    <span className="text-xs font-semibold text-accent-purple mb-2 block uppercase tracking-wider">{item.source}</span>
                    <h4 className="text-[var(--text-main)] font-medium mb-2 group-hover:text-accent-blue transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center text-xs text-[var(--text-muted)] gap-3">
                      <span className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {item.views} readers
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <button className="w-full mt-8 py-3 rounded-lg border border-[var(--border-color)] text-sm font-semibold hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                Explore Full Terminal
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
