import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function VendorAnalyticsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = parseInt(session.user.id);

    // Get vendor profile
    const profile = await prisma.vendorProfile.findUnique({
        where: { userId },
        include: {
            inquiries: {
                orderBy: { createdAt: 'desc' },
                take: 30, // Last 30 inquiries for trend
            },
            reviews: {
                where: { isPublished: true },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!profile) {
        redirect('/become-vendor');
    }

    // Calculate analytics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Inquiry stats
    const totalInquiries = profile.inquiries.length;
    const inquiriesLast30Days = profile.inquiries.filter(
        (i) => new Date(i.createdAt) >= thirtyDaysAgo
    ).length;
    const inquiriesLast7Days = profile.inquiries.filter(
        (i) => new Date(i.createdAt) >= sevenDaysAgo
    ).length;

    // Inquiry status breakdown
    const inquiryStatusCounts = profile.inquiries.reduce((acc, inquiry) => {
        acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Review stats
    const totalReviews = profile.reviews.length;
    const avgRating = profile.avgRating ? Number(profile.avgRating).toFixed(1) : null;

    // Rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: profile.reviews.filter((r) => r.rating === rating).length,
    }));

    // Conversion rate
    const convertedInquiries = inquiryStatusCounts['CONVERTED'] || 0;
    const conversionRate = totalInquiries > 0
        ? ((convertedInquiries / totalInquiries) * 100).toFixed(1)
        : '0';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                        <p className="mt-1 text-gray-500">Track your business performance</p>
                    </div>
                    <Link
                        href="/vendor/dashboard"
                        className="text-sm text-purple-600 hover:underline"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Key Metrics */}
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-white p-6">
                        <div className="text-sm font-medium text-gray-500">Total Inquiries</div>
                        <div className="mt-2 text-3xl font-bold text-gray-900">{totalInquiries}</div>
                        <div className="mt-1 text-sm text-gray-500">
                            {inquiriesLast7Days} this week
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6">
                        <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                        <div className="mt-2 text-3xl font-bold text-green-600">{conversionRate}%</div>
                        <div className="mt-1 text-sm text-gray-500">
                            {convertedInquiries} converted
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6">
                        <div className="text-sm font-medium text-gray-500">Total Reviews</div>
                        <div className="mt-2 text-3xl font-bold text-gray-900">{totalReviews}</div>
                        <div className="mt-1 text-sm text-gray-500">
                            from verified customers
                        </div>
                    </div>
                    <div className="rounded-xl border bg-white p-6">
                        <div className="text-sm font-medium text-gray-500">Average Rating</div>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-3xl font-bold text-amber-500">{avgRating || '-'}</span>
                            <span className="text-2xl text-amber-500">★</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">out of 5 stars</div>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    {/* Inquiry Funnel */}
                    <div className="rounded-xl border bg-white p-6">
                        <h2 className="font-semibold text-gray-900">Inquiry Funnel</h2>
                        <p className="mt-1 text-sm text-gray-500">Status breakdown of all inquiries</p>

                        <div className="mt-6 space-y-4">
                            {[
                                { status: 'NEW', label: 'New', color: 'bg-blue-500' },
                                { status: 'CONTACTED', label: 'Contacted', color: 'bg-yellow-500' },
                                { status: 'CONVERTED', label: 'Converted', color: 'bg-green-500' },
                                { status: 'CLOSED', label: 'Closed', color: 'bg-gray-400' },
                            ].map(({ status, label, color }) => {
                                const count = inquiryStatusCounts[status] || 0;
                                const percentage = totalInquiries > 0
                                    ? (count / totalInquiries) * 100
                                    : 0;
                                return (
                                    <div key={status}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">{label}</span>
                                            <span className="font-medium text-gray-900">{count}</span>
                                        </div>
                                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full ${color} transition-all`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="rounded-xl border bg-white p-6">
                        <h2 className="font-semibold text-gray-900">Rating Distribution</h2>
                        <p className="mt-1 text-sm text-gray-500">Breakdown of customer ratings</p>

                        <div className="mt-6 space-y-3">
                            {ratingDistribution.map(({ rating, count }) => {
                                const percentage = totalReviews > 0
                                    ? (count / totalReviews) * 100
                                    : 0;
                                return (
                                    <div key={rating} className="flex items-center gap-3">
                                        <div className="flex w-16 items-center gap-1">
                                            <span className="text-sm font-medium text-gray-900">{rating}</span>
                                            <span className="text-amber-500">★</span>
                                        </div>
                                        <div className="flex-1 h-3 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="h-full bg-amber-500 transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="w-8 text-right text-sm text-gray-500">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 rounded-xl border bg-white p-6">
                    <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
                    <p className="mt-1 text-sm text-gray-500">Last 10 inquiries received</p>

                    {profile.inquiries.length > 0 ? (
                        <div className="mt-4 divide-y">
                            {profile.inquiries.slice(0, 10).map((inquiry) => (
                                <div key={inquiry.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {inquiry.eventDate
                                                ? `Event on ${new Date(inquiry.eventDate).toLocaleDateString()}`
                                                : 'General Inquiry'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                            inquiry.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-700' :
                                                inquiry.status === 'CONVERTED' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        {inquiry.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 text-center text-gray-500">
                            No inquiries yet. Once you start receiving inquiries, they'll appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
