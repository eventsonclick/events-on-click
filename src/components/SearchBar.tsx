'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);

        if (query.trim()) {
            params.set('q', query.trim());
        } else {
            params.delete('q');
        }

        startTransition(() => {
            router.push(`/vendors?${params.toString()}`);
        });
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vendors..."
                className="w-full bg-white border border-stone-200 px-4 py-3 pl-10 text-sm placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
                style={{ borderRadius: '2px' }} // Sharp elegance
            />
            <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-900 border-t-transparent" />
                </div>
            )}
        </form>
    );
}
