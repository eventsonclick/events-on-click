import Link from 'next/link';
import { Suspense } from 'react';
import { getVendors, getCategories, getCities, getAmenities, getOccasions } from '@/lib/data';
import VendorCard from '@/components/VendorCard';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function VendorsPage({ searchParams }: Props) {
    const params = await searchParams;

    const city = typeof params.city === 'string' ? params.city : undefined;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const search = typeof params.q === 'string' ? params.q : undefined;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

    // Fetch data in parallel
    const [vendorData, categories, cities, amenities, occasions] = await Promise.all([
        getVendors({ citySlug: city, categorySlug: category, search, page }),
        getCategories(),
        getCities(),
        getAmenities(),
        getOccasions(),
    ]);

    const { vendors, total, totalPages } = vendorData;

    return (
        <div className="min-h-screen bg-off-white">
            {/* Page Header - Editorial Style */}
            <div className="bg-white border-b border-stone-200">
                <div className="container-wide py-12 md:py-20">
                    <div className="max-w-4xl">
                        <span className="text-xs font-medium uppercase tracking-widest text-gold-600 mb-4 block">
                            Discover Excellence
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
                            {category
                                ? categories.find((c) => c.slug === category)?.name || 'Curated Vendors'
                                : 'The Collection'}
                            {city && <span className="text-stone-400 italic font-light"> in {cities.find((c) => c.slug === city)?.name || city}</span>}
                        </h1>

                        {search && (
                            <p className="mt-4 text-lg text-stone-500 font-light italic">
                                Showing results for &ldquo;{search}&rdquo;
                            </p>
                        )}

                        <div className="mt-8 max-w-lg">
                            <Suspense fallback={<div className="h-12 bg-stone-100 animate-pulse rounded-sm" />}>
                                <SearchBar />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-wide py-12">
                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Filters - Sticky Sidebar */}
                    <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit">
                        <FilterSidebar
                            categories={categories}
                            cities={cities.map((c) => ({ ...c, state: c.state || { name: '' } }))}
                            amenities={amenities}
                            occasions={occasions}
                            currentFilters={{ city, category }}
                        />
                    </div>

                    {/* Vendor Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
                            <p className="text-sm font-medium uppercase tracking-widest text-stone-500">
                                {total} {total === 1 ? 'Result' : 'Results'} Found
                            </p>
                            {/* Sort could go here */}
                        </div>

                        {vendors.length > 0 ? (
                            <>
                                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                                    {vendors.map((vendor) => (
                                        <VendorCard
                                            key={vendor.id}
                                            vendor={{
                                                ...vendor,
                                                city: vendor.city ? { ...vendor.city, state: vendor.city.state || null } : null,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Pagination - Minimal */}
                                {totalPages > 1 && (
                                    <div className="mt-20 flex justify-center gap-4">
                                        {page > 1 && (
                                            <Link
                                                href={`/vendors?${new URLSearchParams({
                                                    ...(city ? { city } : {}),
                                                    ...(category ? { category } : {}),
                                                    page: String(page - 1),
                                                }).toString()}`}
                                                className="text-sm font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        <span className="text-sm font-medium tracking-widest text-stone-900">
                                            {page} / {totalPages}
                                        </span>
                                        {page < totalPages && (
                                            <Link
                                                href={`/vendors?${new URLSearchParams({
                                                    ...(city ? { city } : {}),
                                                    ...(category ? { category } : {}),
                                                    page: String(page + 1),
                                                }).toString()}`}
                                                className="text-sm font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-24 text-center border border-dashed border-stone-200 bg-white">
                                <span className="block text-4xl mb-4 opacity-30">❖</span>
                                <h3 className="text-2xl font-serif text-stone-900 mb-2">No matching vendors</h3>
                                <p className="text-stone-500 font-light mb-6">
                                    We couldn't find exactly what you're looking for.
                                </p>
                                <Link
                                    href="/vendors"
                                    className="btn-elegant-outline inline-block"
                                >
                                    Clear Filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
