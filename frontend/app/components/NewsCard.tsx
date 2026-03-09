import React from 'react';
import Image from 'next/image';

interface NewsCardProps {
    category?: string;
    title: string;
    summary: string;
    url?: string;
    image?: string;
    source?: string;
    linkText?: string;
    delay?: number;
}

export default React.memo(function NewsCard({ category, title, summary, url = "#", image, source, linkText = "Read Full Article →", delay = 0 }: NewsCardProps) {
    return (
        <article
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)] p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-accent-blue/40"
            style={{ animationDelay: `${delay}s`, animation: `fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`, opacity: 0, transform: 'translateY(20px)' }}
        >
            {/* Image Thumbnail */}
            {image ? (
                <div className="relative h-48 w-full overflow-hidden rounded-lg mb-4 bg-gray-800">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            ) : (
                <div className="relative h-48 w-full overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-[var(--text-muted)] text-sm">No Image</span>
                </div>
            )}

            {/* Content Body */}
            <div className="flex flex-col flex-grow">
                {/* Badges */}
                <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider">
                    <span className="text-accent-blue px-2 py-1 bg-accent-blue/10 rounded-md">{category || "News"}</span>
                    {source && <span className="text-[var(--text-muted)]">{source}</span>}
                </div>

                {/* Title */}
                <a href={url} target="_blank" rel="noopener noreferrer" className="block focus:outline-none focus:ring-2 focus:ring-accent-blue rounded">
                    <h3 className="text-lg font-semibold leading-tight text-[var(--text-main)] mb-3 group-hover:text-accent-blue transition-colors line-clamp-2">
                        {title}
                    </h3>
                </a>

                {/* Summary */}
                <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {summary}
                </p>

                {/* Link */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center text-sm font-medium text-accent-green hover:text-accent-blue transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue rounded inline-block"
                >
                    {linkText}
                </a>
            </div>
        </article>
    );
});
