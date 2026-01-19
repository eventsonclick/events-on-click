export default function VendorDashboardLoading() {
    return (
        <div className="min-h-screen bg-stone-50 py-8 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="h-8 w-56 bg-stone-200 animate-pulse rounded mb-2" />
                    <div className="h-4 w-72 bg-stone-100 animate-pulse rounded" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 border border-stone-200">
                            <div className="h-4 w-20 bg-stone-100 animate-pulse rounded mb-3" />
                            <div className="h-10 w-24 bg-stone-200 animate-pulse rounded" />
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-8 border border-stone-200">
                            <div className="h-6 w-32 bg-stone-200 animate-pulse rounded mb-4" />
                            <div className="h-4 w-full bg-stone-100 animate-pulse rounded mb-6" />
                            <div className="h-10 w-full bg-stone-200 animate-pulse rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
