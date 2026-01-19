export default function HomeLoading() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Skeleton */}
            <section className="relative px-6 py-24 text-center lg:py-32 bg-stone-50">
                <div className="mx-auto max-w-5xl space-y-6">
                    <div className="h-4 w-24 bg-stone-200 animate-pulse rounded mx-auto" />
                    <div className="h-16 w-3/4 bg-stone-200 animate-pulse rounded mx-auto" />
                    <div className="h-16 w-1/2 bg-stone-100 animate-pulse rounded mx-auto" />
                    <div className="h-4 w-96 bg-stone-100 animate-pulse rounded mx-auto mt-8" />
                    <div className="flex justify-center gap-4 mt-8">
                        <div className="h-12 w-40 bg-stone-300 animate-pulse rounded" />
                        <div className="h-12 w-40 bg-stone-200 animate-pulse rounded" />
                    </div>
                </div>
            </section>

            {/* Categories Skeleton */}
            <section className="px-6 py-24 container-wide">
                <div className="flex justify-between items-end mb-12 border-b border-stone-200 pb-6">
                    <div>
                        <div className="h-8 w-48 bg-stone-200 animate-pulse rounded mb-2" />
                        <div className="h-4 w-64 bg-stone-100 animate-pulse rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-96 bg-stone-100 animate-pulse" />
                    ))}
                </div>
            </section>
        </div>
    );
}
