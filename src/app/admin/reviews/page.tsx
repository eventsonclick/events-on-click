import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { deleteReview } from '@/app/actions/admin';

export default async function AdminReviewsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // @ts-ignore
    const roleId = session?.user?.roleId;
    if (roleId !== 1) {
        redirect('/');
    }

    // Fetch all reviews with vendor and user info
    const reviews = await prisma.vendorReview.findMany({
        include: {
            vendor: {
                select: {
                    id: true,
                    businessName: true,
                    slug: true,
                },
            },
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    const publishedCount = reviews.filter(r => r.isPublished).length;
    const pendingCount = reviews.filter(r => !r.isPublished).length;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                <p className="mt-1 text-gray-500">
                    Manage and moderate vendor reviews.
                </p>

                {/* Stats */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
                        <div className="text-sm text-gray-500">Total Reviews</div>
                    </div>
                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
                        <div className="text-sm text-gray-500">Published</div>
                    </div>
                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                        <div className="text-sm text-gray-500">Pending</div>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="mt-8 overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Reviewer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Vendor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Review
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {reviews.map((review) => (
                                <tr key={review.id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {review.user?.fullName || 'Unknown'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {review.user?.email}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {review.vendor?.businessName || `Vendor #${review.vendorId}`}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500">★</span>
                                            <span className="text-sm font-medium">{review.rating}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate text-sm text-gray-600">
                                            {review.reviewText || 'No comment'}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${review.isPublished
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {review.isPublished ? 'Published' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <form action={async () => {
                                            'use server';
                                            await deleteReview(review.id);
                                        }}>
                                            <button
                                                type="submit"
                                                className="text-xs text-red-500 hover:text-red-700 uppercase tracking-wider font-medium"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {reviews.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="text-4xl">⭐</div>
                            <p className="mt-2 text-gray-500">No reviews yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
