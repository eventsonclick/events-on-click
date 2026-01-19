export default function VendorsLoading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton */}
            <div className="bg-stone-50 px-6 py-16">
                <div className="container-wide">
                    <div className="h-8 w-48 bg-stone-200 animate-pulse rounded mb-4" />
                    <div className="h-4 w-72 bg-stone-100 animate-pulse rounded" />
                </div>
            </div>

            <div className="container-wide px-6 py-12">
                <div className="flex gap-12">
                    {/* Sidebar Skeleton */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="space-y-6">
                            <div className="h-6 w-32 bg-stone-200 animate-pulse rounded" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-4 w-full bg-stone-100 animate-pulse rounded" />
                                ))}
                            </div>
                            <div className="h-6 w-24 bg-stone-200 animate-pulse rounded mt-8" />
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 w-full bg-stone-100 animate-pulse rounded" />
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Grid Skeleton */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-4/3 bg-stone-100 animate-pulse" />
                                    <div className="h-6 w-3/4 bg-stone-200 animate-pulse rounded" />
                                    <div className="h-4 w-1/2 bg-stone-100 animate-pulse rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
