"use client";
import React from 'react';

export default function Ticker() {
    const tickerItems = [
        { symbol: "BTC", price: "$63,245", change: "+2.4%", isPositive: true },
        { symbol: "ETH", price: "$3,240", change: "-1.2%", isPositive: false },
        { symbol: "NASDAQ", price: "20,292", change: "+0.8%", isPositive: true },
        { symbol: "S&P500", price: "5,431", change: "+0.5%", isPositive: true },
        { symbol: "GOLD", price: "$2,350", change: "-0.2%", isPositive: false },
    ];

    // Duplicate logic for smooth scrolling
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
