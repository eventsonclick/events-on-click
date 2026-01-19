export default function VendorProfileLoading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Skeleton */}
            <div className="h-[60vh] bg-stone-200 animate-pulse" />

            {/* Content */}
            <div className="container-wide px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        {/* Title */}
                        <div className="space-y-4">
                            <div className="h-10 w-3/4 bg-stone-200 animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-stone-100 animate-pulse rounded" />
                            <div className="flex gap-4 mt-4">
                                <div className="h-6 w-20 bg-stone-100 animate-pulse rounded" />
                                <div className="h-6 w-24 bg-stone-100 animate-pulse rounded" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-stone-100 animate-pulse rounded" />
                            <div className="h-4 w-full bg-stone-100 animate-pulse rounded" />
                            <div className="h-4 w-3/4 bg-stone-100 animate-pulse rounded" />
                        </div>

                        {/* Gallery */}
                        <div>
                            <div className="h-6 w-24 bg-stone-200 animate-pulse rounded mb-4" />
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square bg-stone-100 animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <div className="h-6 w-32 bg-stone-200 animate-pulse rounded mb-6" />
                            {[1, 2].map((i) => (
                                <div key={i} className="p-6 bg-stone-50 mb-4">
                                    <div className="h-4 w-32 bg-stone-200 animate-pulse rounded mb-3" />
                                    <div className="h-3 w-full bg-stone-100 animate-pulse rounded" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-[400px] shrink-0">
                        <div className="bg-stone-50 p-8 space-y-6">
                            <div className="h-8 w-40 bg-stone-200 animate-pulse rounded" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-full bg-stone-100 animate-pulse rounded" />
                                ))}
                            </div>
                            <div className="h-12 w-full bg-stone-300 animate-pulse rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
