import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-8xl">🔍</div>
                <h1 className="mt-4 text-4xl font-bold text-gray-900">Page Not Found</h1>
                <p className="mt-2 text-gray-600">
                    Sorry, we couldn't find the page you're looking for.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/"
                        className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-500"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/vendors"
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Browse Vendors
                    </Link>
                </div>
            </div>
        </div>
    );
}
