import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // @ts-ignore
    const roleId = session?.user?.roleId;
    if (roleId !== 1) { // ADMIN role is ID 1
        redirect('/');
    }

    // Fetch stats
    const [userCount, vendorCount, inquiryCount, reviewCount] = await Promise.all([
        prisma.user.count(),
        prisma.vendorProfile.count(),
        prisma.inquiry.count(),
        prisma.vendorReview.count(),
    ]);

    const stats = [
        { label: 'Total Users', value: userCount, href: '/admin/users' },
        { label: 'Total Vendors', value: vendorCount, href: '/admin/vendors' },
        { label: 'Inquiries', value: inquiryCount, href: '/admin/inquiries' },
        { label: 'Reviews', value: reviewCount, href: '/admin/reviews' },
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Top Bar - Dark */}
            <header className="bg-stone-900 border-b border-stone-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="text-stone-100 font-serif text-xl">Admin<span className="text-stone-500 font-sans text-sm ml-2 tracking-widest uppercase">Console</span></span>

                    <div className="flex items-center gap-4">
                        <span className="text-stone-400 text-xs uppercase tracking-widest">{session.user.email}</span>
                        <Link href="/" className="text-xs text-gold-500 hover:text-gold-400 uppercase tracking-widest">
                            View Site
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-serif text-stone-900">Dashboard Overview</h1>
                    <p className="mt-2 text-stone-500 font-light">Platform performance metrics and management.</p>
                </div>

                {/* Stats Grid - Minimal */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                    {stats.map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="bg-white p-8 border border-stone-100 hover:border-stone-900 transition-colors group"
                        >
                            <span className="text-4xl font-serif text-stone-900 mb-2 block group-hover:scale-110 origin-left transition-transform duration-500">
                                {stat.value}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-stone-400 group-hover:text-gold-600 transition-colors">
                                {stat.label}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Management Section */}
                <h2 className="text-sm font-medium uppercase tracking-widest text-stone-400 mb-6">
                    Management
                </h2>
                <div className="grid gap-6 sm:grid-cols-3">
                    <Link
                        href="/admin/vendors"
                        className="bg-white p-6 border-l-2 border-stone-200 hover:border-stone-900 transition-all group"
                    >
                        <h3 className="text-lg font-serif text-stone-900 mb-2">Vendors</h3>
                        <p className="text-sm text-stone-500 font-light mb-4">
                            Approve new listings and verify profiles.
                        </p>
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-300 group-hover:text-stone-900 transition-colors">Manage →</span>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="bg-white p-6 border-l-2 border-stone-200 hover:border-stone-900 transition-all group"
                    >
                        <h3 className="text-lg font-serif text-stone-900 mb-2">Users</h3>
                        <p className="text-sm text-stone-500 font-light mb-4">
                            Manage user accounts and permissions.
                        </p>
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-300 group-hover:text-stone-900 transition-colors">Manage →</span>
                    </Link>

                    <Link
                        href="/admin/reviews"
                        className="bg-white p-6 border-l-2 border-stone-200 hover:border-stone-900 transition-all group"
                    >
                        <h3 className="text-lg font-serif text-stone-900 mb-2">Content</h3>
                        <p className="text-sm text-stone-500 font-light mb-4">
                            Moderate reviews and platform content.
                        </p>
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-300 group-hover:text-stone-900 transition-colors">Manage →</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
