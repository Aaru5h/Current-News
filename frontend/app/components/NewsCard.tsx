import React from 'react';

interface NewsCardProps {
    category: string;
    title: string;
    summary: string;
    linkText?: string;
    delay?: number;
}

export default function NewsCard({ category, title, summary, linkText = "Read Full Story", delay = 0 }: NewsCardProps) {
    return (
        <article
            className="news-card glass-panel animate-fade-up"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="news-card-image"></div>
            <div className="news-card-body">
                <span className="news-category">{category}</span>
                <h3 className="news-title">{title}</h3>
                <p className="news-summary">{summary}</p>
                <a href="#" className="news-link">
                    {linkText}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>
        </article>
    );
}
