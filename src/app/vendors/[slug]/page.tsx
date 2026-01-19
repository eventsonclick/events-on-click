import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getVendorBySlug, getOccasions } from '@/lib/data';
import InquiryForm from '@/components/InquiryForm';
import ReviewForm from '@/components/ReviewForm';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function VendorProfilePage({ params }: Props) {
    const { slug } = await params;

    const [fetchedVendor, occasions, session] = await Promise.all([
        getVendorBySlug(slug),
        getOccasions(),
        auth(),
    ]);

    if (!fetchedVendor) {
        notFound();
    }

    const vendor = fetchedVendor as any;

    const isLoggedIn = !!session?.user?.id;
    // @ts-ignore
    const roleId = session?.user?.roleId;
    const isVendor = roleId === 2;
    const isAdmin = roleId === 1;

    const rating = vendor.avgRating ? Number(vendor.avgRating).toFixed(1) : null;
    const coverImage = vendor.gallery?.find((img: any) => img.isCoverImage) || vendor.gallery?.[0];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image - Cinematic */}
            <div className="relative h-[60vh] bg-stone-900 overflow-hidden">
                {coverImage ? (
                    <img
                        src={coverImage.mediaUrl}
                        alt={vendor.businessName}
                        className="w-full h-full object-cover opacity-80"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-700">
                        <span className="font-serif italic text-4xl">No Cover Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                    <div className="container-wide">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-medium uppercase tracking-widest text-gold-400">
                                        {vendor.category?.name}
                                    </span>
                                    {vendor.isVerified && (
                                        <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-5xl md:text-7xl font-serif leading-none mb-2">
                                    {vendor.businessName}
                                </h1>
                                <p className="text-lg font-light text-stone-300 flex items-center gap-2">
                                    <span className="opacity-70">Based in</span> {vendor.city?.name}{vendor.city?.state && `, ${vendor.city.state.name}`}
                                </p>
                            </div>

                            {rating && (
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-3xl font-serif text-white">{rating}</span>
                                        <span className="text-gold-400 text-2xl">★</span>
                                    </div>
                                    <p className="text-xs uppercase tracking-widest text-stone-400">
                                        {vendor.reviewCount} Verified Reviews
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container-wide py-16">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column - Details */}
                    <div className="flex-1 space-y-16">

                        {/* About / Bio Placeholder */}
                        <section>
                            <h2 className="text-2xl font-serif text-stone-900 mb-6">About</h2>
                            <p className="text-stone-600 font-light leading-relaxed text-lg">
                                {vendor.description ||
                                    `Experience excellence with ${vendor.businessName}. We specialize in creating unforgettable moments for your special occasions. Our team is dedicated to providing top-tier service in ${vendor.city?.name}.`}
                            </p>
                        </section>

                        {/* Gallery Grid */}
                        {vendor.gallery.length > 1 && (
                            <section>
                                <h2 className="text-2xl font-serif text-stone-900 mb-6">Portfolio</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {vendor.gallery.slice(1, 7).map((img: any, idx: number) => (
                                        <div key={idx} className="aspect-square overflow-hidden bg-stone-100 group">
                                            <img
                                                src={img.mediaUrl}
                                                alt={`Gallery ${idx}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 gap-12 border-t border-stone-200 pt-12">
                            {vendor.occasions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium uppercase tracking-widest text-stone-400 mb-4">
                                        Specialties
                                    </h3>
                                    <ul className="space-y-2">
                                        {vendor.occasions.map((mapping: any) => (
                                            <li key={mapping.occasion.id} className="text-stone-700 font-serif text-lg">
                                                {mapping.occasion.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {vendor.amenities.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium uppercase tracking-widest text-stone-400 mb-4">
                                        Amenities & Features
                                    </h3>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {vendor.amenities.map((mapping: any) => (
                                            <li key={mapping.amenity.id} className="text-stone-600 font-light flex items-center gap-2">
                                                <span className="text-gold-500 text-xs">●</span> {mapping.amenity.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <section className="border-t border-stone-200 pt-16">
                            <h2 className="text-2xl font-serif text-stone-900 mb-8">Client Reviews</h2>

                            {vendor.reviews.length > 0 ? (
                                <div className="space-y-8">
                                    {vendor.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-stone-50 p-8 border border-stone-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-serif text-lg text-stone-900">{review.user.fullName || 'Client'}</h4>
                                                <div className="flex text-gold-500 text-sm">{'★'.repeat(review.rating)}</div>
                                            </div>
                                            {review.reviewText && (
                                                <p className="text-stone-600 font-light italic">"{review.reviewText}"</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-stone-500 font-light italic">No reviews yet. Be the first to review!</p>
                            )}

                            {!isVendor && !isAdmin && (
                                <div className="mt-12">
                                    <ReviewForm
                                        vendorId={vendor.id}
                                        vendorName={vendor.businessName || 'this vendor'}
                                        isLoggedIn={isLoggedIn}
                                    />
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column - Sticky Contact */}
                    <div className="w-full lg:w-[400px] shrink-0">
                        <div className="sticky top-24">
                            {!isVendor ? (
                                <InquiryForm
                                    vendorId={vendor.id}
                                    vendorName={vendor.businessName || 'this vendor'}
                                    occasions={vendor.occasions.map((m: any) => m.occasion)}
                                />
                            ) : (
                                <div className="bg-stone-900 text-stone-50 p-8 text-center">
                                    <span className="block text-4xl mb-4">👁</span>
                                    <h3 className="font-serif text-xl mb-2">Preview Mode</h3>
                                    <p className="text-stone-400 font-light text-sm">
                                        This is how clients see your profile. <br /> Sign in as a user to test inquiries.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
