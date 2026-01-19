export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-stone-50 py-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="h-8 w-48 bg-stone-200 animate-pulse rounded mb-2" />
                    <div className="h-4 w-64 bg-stone-100 animate-pulse rounded" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 border border-stone-200">
                            <div className="h-4 w-24 bg-stone-100 animate-pulse rounded mb-3" />
                            <div className="h-8 w-16 bg-stone-200 animate-pulse rounded" />
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-white border border-stone-200">
                    <div className="p-6 border-b border-stone-200">
                        <div className="h-6 w-32 bg-stone-200 animate-pulse rounded" />
                    </div>
                    <div className="divide-y divide-stone-100">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 flex items-center gap-6">
                                <div className="h-4 w-32 bg-stone-100 animate-pulse rounded" />
                                <div className="h-4 w-48 bg-stone-100 animate-pulse rounded" />
                                <div className="h-4 w-24 bg-stone-100 animate-pulse rounded ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
