import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
    featuredNews?: any;
    importantNews?: any[];
}

export default function HeroSection({ featuredNews, importantNews = [] }: HeroSectionProps) {
    if (!featuredNews) return null;

    return (
        <section className="w-full mb-12">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left - Featured Article */}
                <a href={featuredNews.url || "#"} target="_blank" rel="noopener noreferrer" className="block lg:w-2/3 group relative overflow-hidden rounded-2xl bg-[var(--panel-bg)] border border-[var(--border-color)] transition-all duration-300 hover:border-accent-blue/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <div className="relative h-[400px] sm:h-[500px] w-full bg-gray-800 overflow-hidden">
                        {featuredNews.image ? (
                            <Image
                                src={featuredNews.image}
                                alt={featuredNews.title}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/20 rounded-md backdrop-blur-sm">
                                {featuredNews.category || "Top Story"}
                            </span>
                            {featuredNews.source && (
                                <span className="text-sm font-medium text-gray-300">{featuredNews.source}</span>
                            )}
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-accent-blue transition-colors line-clamp-3">
                            {featuredNews.title}
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300 line-clamp-2 md:line-clamp-3 max-w-3xl">
                            {featuredNews.summary}
                        </p>
                    </div>
                </a>

                {/* Right - Important Articles */}
                <div className="lg:w-1/3 flex flex-col gap-6">
                    {importantNews.slice(0, 2).map((news, idx) => (
                        <a key={idx} href={news.url || "#"} target="_blank" rel="noopener noreferrer" className="block flex-1 group relative overflow-hidden rounded-2xl bg-[var(--panel-bg)] border border-[var(--border-color)] p-6 transition-all duration-300 hover:border-accent-blue/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-accent-green" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-accent-green">
                                        {news.category || "Trending"}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3 leading-snug group-hover:text-accent-blue transition-colors line-clamp-3">
                                    {news.title}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-3">
                                    {news.summary}
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-gray-500">{news.source || "News"}</span>
                                <span className="text-accent-blue group-hover:translate-x-1 transition-transform inline-block font-medium">Read →</span>
                            </div>
                        </a>
                    ))}

                    {/* Fill empty space if < 2 important news */}
                    {importantNews.length < 2 && (
                        Array.from({ length: 2 - importantNews.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="flex-1 rounded-2xl bg-[var(--panel-bg)] border border-[var(--border-color)] border-dashed opacity-50 flex items-center justify-center p-6 min-h-[200px]">
                                <span className="text-[var(--text-muted)] text-sm">More stories developing...</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
