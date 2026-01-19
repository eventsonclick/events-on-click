import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AdminInquiriesPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // @ts-ignore
    const roleId = session?.user?.roleId;
    if (roleId !== 1) {
        redirect('/');
    }

    // Fetch all inquiries with vendor and user info
    const inquiries = await prisma.inquiry.findMany({
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
            occasion: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    const statusCounts = {
        NEW: inquiries.filter(i => i.status === 'NEW').length,
        CONTACTED: inquiries.filter(i => i.status === 'CONTACTED').length,
        CONVERTED: inquiries.filter(i => i.status === 'CONVERTED').length,
        CLOSED: inquiries.filter(i => i.status === 'CLOSED').length,
    };

    const statusColors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-700',
        CONTACTED: 'bg-yellow-100 text-yellow-700',
        CONVERTED: 'bg-green-100 text-green-700',
        CLOSED: 'bg-gray-100 text-gray-600',
        PENDING: 'bg-blue-100 text-blue-700',
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900">Inquiry Management</h1>
                <p className="mt-1 text-gray-500">
                    View all inquiries across vendors.
                </p>

                {/* Stats */}
                <div className="mt-6 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-2xl font-bold text-blue-600">{statusCounts.NEW}</div>
                        <div className="text-sm text-gray-500">New</div>
                    </div>
                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-2xl font-bold text-yellow-600">{statusCounts.CONTACTED}</div>
                        <div className="text-sm text-gray-500">Contacted</div>
                    </div>
                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-2xl font-bold text-green-600">{statusCounts.CONVERTED}</div>
                        <div className="text-sm text-gray-500">Converted</div>
                    </div>
                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-2xl font-bold text-gray-600">{statusCounts.CLOSED}</div>
                        <div className="text-sm text-gray-500">Closed</div>
                    </div>
                </div>

                {/* Inquiries Table */}
                <div className="mt-8 overflow-hidden rounded-xl border bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    From
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Vendor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Occasion
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Event Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Received
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {inquiry.user?.fullName || 'Guest'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {inquiry.user?.email || 'No email'}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {inquiry.vendor?.businessName || `Vendor #${inquiry.vendorId}`}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {inquiry.occasion?.name || 'General'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                        {inquiry.eventDate
                                            ? new Date(inquiry.eventDate).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {inquiry.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {inquiries.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="text-4xl">💬</div>
                            <p className="mt-2 text-gray-500">No inquiries yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
