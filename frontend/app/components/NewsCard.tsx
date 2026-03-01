import React from 'react';

interface NewsCardProps {
    category: string;
    title: string;
    summary: string;
    url?: string;
    image?: string;
    source?: string;
    linkText?: string;
    delay?: number;
}

export default function NewsCard({ category, title, summary, url, image, source, linkText = "Read Full Story", delay = 0 }: NewsCardProps) {
    return (
        <article
            className="news-card glass-panel animate-fade-up"
            style={{ animationDelay: `${delay}s` }}
        >
            {image ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <div
                        className="news-card-image"
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    ></div>
                </a>
            ) : (
                <div className="news-card-image"></div>
            )}
            <div className="news-card-body">
                <div className="flex items-center justify-between mb-2">
                    <span className="news-category">{category}</span>
                    {source && <span className="text-xs text-[var(--text-muted)]">{source}</span>}
                </div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
                    <h3 className="news-title group-hover:text-accent-blue transition-colors">{title}</h3>
                </a>
                <p className="news-summary">{summary}</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                >
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
