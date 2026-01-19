'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-8xl">⚠️</div>
                <h1 className="mt-4 text-4xl font-bold text-gray-900">Something went wrong</h1>
                <p className="mt-2 text-gray-600">
                    An unexpected error occurred. Please try again.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={reset}
                        className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-500"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
