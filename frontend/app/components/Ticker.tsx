"use client";
import React, { useState, useEffect } from 'react';

export default function Ticker() {
    const [tickerItems, setTickerItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchQuotes = async () => {
            const symbols = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN"];
            try {
                const results = await Promise.all(
                    symbols.map(async (sym) => {
                        const res = await fetch(`http://localhost:5001/api/markets/stock/${sym}`);
                        if (!res.ok) return null;
                        const data = await res.json();
                        return {
                            symbol: sym,
                            price: `$${data.regularMarketPrice.toFixed(2)}`,
                            change: `${data.regularMarketChangePercent > 0 ? '+' : ''}${data.regularMarketChangePercent.toFixed(2)}%`,
                            isPositive: data.regularMarketChangePercent > 0
                        };
                    })
                );

                const validResults = results.filter(r => r !== null);
                setTickerItems([...validResults, ...validResults, ...validResults, ...validResults]);
            } catch (error) {
                console.error("Failed to fetch quotes", error);
            }
        };
        fetchQuotes();
    }, []);

    if (tickerItems.length === 0) return null;

    return (
        <div className="ticker-container">
            <div className="ticker-content">
                {tickerItems.map((item, index) => (
                    <div key={index} className="ticker-item">
                        <span>{item.symbol}</span>
                        <span className="ticker-price">{item.price}</span>
                        <span className={item.isPositive ? "ticker-positive" : "ticker-negative"}>
                            {item.change}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
