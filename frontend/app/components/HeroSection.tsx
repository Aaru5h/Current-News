import React from 'react';

export default function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden py-24 mb-16">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-accent-blue opacity-10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-accent-green opacity-10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-xs font-semibold tracking-widest uppercase text-accent-green mb-6">
                        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                        Breaking Now
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                        The Future of <br />
                        <span className="gradient-text-blue">Finance</span> is Here.
                    </h1>
                    <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-10 leading-relaxed">
                        Stay ahead of the market with real-time AI-curated insights, breaking news, and deep analysis of the global fintech and crypto landscape.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                            Explore Markets
                        </button>
                        <button className="px-8 py-4 rounded-full border border-[var(--border-color)] text-white font-semibold hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                            Read Latest
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-[rgba(41,121,255,0.4)] transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(41,121,255,0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-blue mb-4 block block">Featured Analysis</span>
                        <h2 className="text-2xl font-semibold mb-4 text-white leading-snug">
                            Central Banks Pivot: What It Means for Emerging Tech Stocks
                        </h2>
                        <p className="text-[var(--text-muted)] mb-6 line-clamp-2">
                            As global macroeconomic conditions shift, technology equities may see unprecedented volatility. Our exclusive report breaks down the long-term impact on the sector.
                        </p>
                        <div className="flex items-center gap-4 border-t border-[var(--border-color)] pt-6 mt-6">
                            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                            <div>
                                <p className="text-sm font-medium text-white">Elena Rostova</p>
                                <p className="text-xs text-[var(--text-muted)]">Chief Economist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
