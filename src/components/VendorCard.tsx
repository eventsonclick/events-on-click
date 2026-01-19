import Link from 'next/link';

type Vendor = {
    id: number;
    slug?: string | null;
    businessName: string | null;
    landmark?: string | null;
    avgRating: any;
    reviewCount: number;
    isVerified: boolean;
    category: { name: string; slug: string } | null;
    city: { name: string; state: { name: string } | null } | null;
    area?: { name: string; region: { name: string } | null } | null;
    gallery: { mediaUrl: string | null; isCoverImage: boolean }[];
};

type Props = {
    vendor: Vendor;
};

export default function VendorCard({ vendor }: Props) {
    const coverImage = vendor.gallery?.find((img) => img.isCoverImage) || vendor.gallery?.[0];
    const rating = vendor.avgRating ? Number(vendor.avgRating).toFixed(1) : null;

    // Build location string: Area (if exists) + City, State
    const locationParts = [];
    if (vendor.area?.name) {
        locationParts.push(vendor.area.name);
    }
    if (vendor.city?.name) {
        locationParts.push(vendor.city.name);
    }
    const locationString = locationParts.join(', ');

    return (
        <Link
            href={`/vendors/${vendor.slug || vendor.id}`}
            className="group block bg-white cursor-pointer"
        >
            {/* Image Container - Sharp corners, classic 4:3 */}
            <div className="relative aspect-4/3 overflow-hidden bg-stone-100 mb-4">
                {coverImage?.mediaUrl ? (
                    <img
                        src={coverImage.mediaUrl}
                        alt={vendor.businessName || ''}
                        className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-300">
                        <span className="font-serif italic text-2xl">No Image</span>
                    </div>
                )}

                {/* Verified - Minimal Tag */}
                {vendor.isVerified && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1">
                        <span className="text-[10px] uppercase tracking-widest font-medium text-stone-900">Verified</span>
                    </div>
                )}
            </div>

            {/* Typography Content */}
            <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-serif text-stone-900 group-hover:text-gold-600 transition-colors">
                        {vendor.businessName || 'Unnamed Vendor'}
                    </h3>
                    {rating && (
                        <div className="flex items-center gap-1">
                            <span className="text-gold-500 text-sm">★</span>
                            <span className="text-sm font-medium text-stone-700">{rating}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center text-sm text-stone-500 font-light">
                    <span>
                        {locationString || 'Location not set'}
                    </span>
                    {vendor.category && (
                        <span className="italic">
                            {vendor.category.name}
                        </span>
                    )}
                </div>

                {/* Landmark - if available */}
                {vendor.landmark && (
                    <p className="text-xs text-stone-400 font-light truncate">
                        📍 {vendor.landmark}
                    </p>
                )}
            </div>
        </Link>
    );
}
