import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getVendorProfile, getVendorInquiries } from '@/lib/data';
import InquiriesList from './InquiriesList';

type Props = {
    searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function VendorInquiriesPage({ searchParams }: Props) {
    const session = await auth();
    const params = await searchParams;

    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = parseInt(session.user.id);
    const profile = await getVendorProfile(userId);

    if (!profile) {
        redirect('/become-vendor');
    }

    const status = params.status || 'all';
    const inquiries = await getVendorInquiries(profile.id, status);

    const statuses = [
        { value: 'all', label: 'All' },
        { value: 'NEW', label: 'New' },
        { value: 'CONTACTED', label: 'Contacted' },
        { value: 'CONVERTED', label: 'Converted' },
        { value: 'CLOSED', label: 'Closed' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                        <p className="mt-1 text-gray-500">
                            {inquiries.length} inquiry{inquiries.length !== 1 ? 'ies' : ''} found
                        </p>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="mt-6 flex gap-2">
                    {statuses.map((s) => (
                        <Link
                            key={s.value}
                            href={`/vendor/inquiries${s.value === 'all' ? '' : `?status=${s.value}`}`}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${status === s.value
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {s.label}
                        </Link>
                    ))}
                </div>

                {/* Inquiries List */}
                <InquiriesList inquiries={inquiries} />
            </div>
        </div>
    );
}
