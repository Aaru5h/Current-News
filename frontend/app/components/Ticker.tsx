"use client";
import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Ticker() {
    const [tickerItems, setTickerItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchTicker = async () => {
            try {
                // Try to fetch some known symbols from the market data API
                const symbols = ['BTC', 'ETH', 'AAPL', 'MSFT', 'NVDA'];
                const results: any[] = [];

                for (const symbol of symbols) {
                    try {
                        const res = await fetch(`${API_URL}/api/market/data/${symbol}`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.data) {
                                results.push({
                                    symbol: data.data.symbol,
                                    price: data.data.price ? `$${data.data.price.toLocaleString()}` : "—",
                                    change: data.data.changePercent ? `${data.data.changePercent > 0 ? '+' : ''}${data.data.changePercent.toFixed(1)}%` : "—",
                                    isPositive: (data.data.changePercent || 0) >= 0,
                                });
                            }
                        }
                    } catch {
                        // Skip individual failures
                    }
                }

                setTickerItems(results);
            } catch (err) {
                console.error("Error fetching ticker data:", err);
            }
        };

        fetchTicker();
    }, []);

    if (tickerItems.length === 0) {
        return null; // Don't render ticker if no data
    }

    // Duplicate for smooth scrolling animation
    const displayItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

    return (
        <div className="ticker-container bg-[var(--bg-main)] border-y border-[var(--border-color)]">
            <div className="ticker-content">
                {displayItems.map((item, index) => (
                    <div key={index} className="ticker-item">
                        <span className="font-semibold text-[var(--text-main)]">{item.symbol}</span>
                        <span className="ticker-price text-[var(--text-main)]">{item.price}</span>
                        <span className={item.isPositive ? "text-accent-green" : "text-red-500"}>
                            {item.isPositive ? '▲' : '▼'} {item.change.replace('+', '').replace('-', '')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
