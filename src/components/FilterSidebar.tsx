'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type FilterSidebarProps = {
    categories: { id: number; name: string; slug: string }[];
    cities: { id: number; name: string; slug: string; state: { name: string } }[];
    amenities: { id: number; name: string }[];
    occasions: { id: number; name: string }[];
    currentFilters: {
        city?: string;
        category?: string;
        amenities?: string[];
        occasions?: string[];
    };
};

export default function FilterSidebar({
    categories,
    cities,
    amenities,
    occasions,
    currentFilters,
}: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete('page'); // Reset to page 1 when filtering
        router.push(`/vendors?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/vendors');
    };

    const hasFilters = currentFilters.city || currentFilters.category;

    return (
        <aside className="w-full lg:w-64 shrink-0 transition-opacity duration-300">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-medium uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1">
                    Refine List
                </span>
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-stone-400 hover:text-stone-900 transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="space-y-8">
                {/* City Filter - Minimal Select */}
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Location</label>
                    <div className="relative">
                        <select
                            value={currentFilters.city || ''}
                            onChange={(e) => updateFilter('city', e.target.value || null)}
                            className="w-full appearance-none bg-transparent border-b border-stone-200 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none rounded-none transition-colors"
                        >
                            <option value="">All Locations</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.slug}>
                                    {city.name}, {city.state.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-400 text-xs">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Category</label>
                    <div className="relative">
                        <select
                            value={currentFilters.category || ''}
                            onChange={(e) => updateFilter('category', e.target.value || null)}
                            className="w-full appearance-none bg-transparent border-b border-stone-200 py-2 text-sm text-stone-900 focus:border-stone-900 focus:outline-none rounded-none transition-colors"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-400 text-xs">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Amenities - Simple List */}
                <details className="group" open>
                    <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 list-none">
                        <span>Amenities</span>
                        <span className="text-stone-300 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {amenities.slice(0, 8).map((amenity) => (
                            <span
                                key={amenity.id}
                                className="inline-block border border-stone-200 px-3 py-1 text-[10px] uppercase tracking-wider text-stone-500 hover:border-stone-900 hover:text-stone-900 cursor-pointer transition-colors bg-white hover:bg-stone-50"
                            >
                                {amenity.name}
                            </span>
                        ))}
                    </div>
                </details>

                {/* Occasions */}
                <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 list-none">
                        <span>Occasions</span>
                        <span className="text-stone-300 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {occasions.slice(0, 6).map((occasion) => (
                            <span
                                key={occasion.id}
                                className="inline-block border border-stone-200 px-3 py-1 text-[10px] uppercase tracking-wider text-stone-500 hover:border-stone-900 hover:text-stone-900 cursor-pointer transition-colors bg-white hover:bg-stone-50"
                            >
                                {occasion.name}
                            </span>
                        ))}
                    </div>
                </details>
            </div>
        </aside>
    );
}
