import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function toggleVerification(vendorId: number, currentState: boolean) {
    'use server';
    await prisma.vendorProfile.update({
        where: { id: vendorId },
        data: { isVerified: !currentState },
    });
    revalidatePath('/admin/vendors');
}

export default async function AdminVendorsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // @ts-ignore
    const roleId = session?.user?.roleId;
    if (roleId !== 1) {
        redirect('/');
    }

    const vendors = await prisma.vendorProfile.findMany({
        include: {
            user: {
                select: { email: true, fullName: true },
            },
            category: true,
            city: {
                include: { state: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
                <p className="mt-1 text-gray-500">{vendors.length} vendors found</p>

                <div className="mt-6 overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{vendor.businessName || 'Unnamed'}</p>
                                        <p className="text-sm text-gray-500">/{vendor.slug || vendor.id}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900">{vendor.user.fullName || '-'}</p>
                                        <p className="text-sm text-gray-500">{vendor.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {vendor.category?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {vendor.city?.name || '-'}
                                        {vendor.city?.state && `, ${vendor.city.state.name}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {vendor.avgRating ? (
                                            <span className="text-amber-600">
                                                ⭐ {Number(vendor.avgRating).toFixed(1)} ({vendor.reviewCount})
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">No reviews</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <form action={toggleVerification.bind(null, vendor.id, vendor.isVerified)}>
                                            <button
                                                type="submit"
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${vendor.isVerified
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {vendor.isVerified ? '✓ Verified' : 'Verify'}
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
