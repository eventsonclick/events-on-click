import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getVendorProfile } from '@/lib/data';
import { prisma } from '@/lib/prisma';

export default async function VendorDashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const userId = parseInt(session.user.id);
    const profile = await getVendorProfile(userId);

    if (!profile) {
        redirect('/become-vendor');
    }

    // Fetch actual inquiry count
    const inquiryCount = await prisma.inquiry.count({
        where: { vendorId: profile.id },
    });

    // Calculate profile completeness
    const completenessItems = [
        { label: 'Business Name', done: !!profile.businessName },
        { label: 'Category', done: !!profile.categoryId },
        { label: 'Location', done: !!profile.cityId },
        { label: 'Amenities', done: profile.amenities.length > 0 },
        { label: 'Occasions', done: profile.occasions.length > 0 },
    ];
    const completedCount = completenessItems.filter(item => item.done).length;
    const completenessPercent = Math.round((completedCount / completenessItems.length) * 100);

    return (
        <div className="min-h-screen bg-off-white">
            <div className="container-wide py-12">
                {/* Header - Minimal Luxury */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-stone-200 pb-8">
                    <div>
                        <span className="text-xs font-medium uppercase tracking-widest text-gold-600 block mb-2">
                            Dashboard
                        </span>
                        <h1 className="text-3xl font-serif text-stone-900">
                            Welcome, {profile.businessName || 'Partner'}
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href={`/vendors/${profile.id}`}
                            target="_blank"
                            className="btn-elegant-outline text-xs px-6 py-3"
                        >
                            View Public Profile ↗
                        </Link>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Stats Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Inquiries', value: inquiryCount, bg: 'bg-white' },
                                { label: 'Reviews', value: profile.reviewCount, bg: 'bg-white' },
                                { label: 'Rating', value: profile.avgRating ? Number(profile.avgRating).toFixed(1) : '-', bg: 'bg-white' },
                                { label: 'Views', value: '1.2k', bg: 'bg-stone-100', note: 'Last 30d' },
                            ].map((stat) => (
                                <div key={stat.label} className={`${stat.bg} p-6 border border-stone-100 group hover:border-gold-200 transition-colors`}>
                                    <span className="block text-2xl font-serif text-stone-900 mb-1">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-stone-500">
                                        {stat.label}
                                    </span>
                                    {stat.note && <span className="block text-[10px] text-stone-400 mt-1">{stat.note}</span>}
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity / Actions */}
                        <div className="bg-white border border-stone-100 p-8">
                            <h2 className="text-lg font-serif text-stone-900 mb-6">Quick Actions</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Edit Profile', desc: 'Update business details & amenities', href: '/vendor/onboarding', icon: 'Edit' },
                                    { title: 'Manage Gallery', desc: 'Upload new portfolio images', href: '/vendor/gallery', icon: 'Image' },
                                    { title: 'Inquiries', desc: 'View and respond to leads', href: '/vendor/inquiries', icon: 'MessageCircle' },
                                    { title: 'Analytics', desc: 'Detailed performance metrics', href: '/vendor/analytics', icon: 'BarChart' },
                                ].map((action) => (
                                    <Link
                                        key={action.title}
                                        href={action.href}
                                        className="flex items-start gap-4 p-4 border border-stone-100 hover:border-stone-900 hover:bg-stone-50 transition-all group"
                                    >
                                        <div className="h-10 w-10 flex items-center justify-center bg-stone-100 text-stone-500 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                                            {/* Simple Icons using text/emoji for simplicity in this pass, ideally Lucide icons */}
                                            <span className="text-lg">{action.icon === 'Edit' ? '✎' : action.icon === 'Image' ? '📷' : action.icon === 'MessageCircle' ? '✉' : '📊'}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-stone-900 group-hover:underline decoration-gold-400 underline-offset-4">{action.title}</h3>
                                            <p className="text-xs text-stone-500 mt-1">{action.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Profile Status */}
                    <div className="space-y-8">
                        {/* Profile Card */}
                        <div className="bg-white border border-stone-100 p-8 text-center">
                            <div className="mx-auto w-24 h-24 bg-stone-100 flex items-center justify-center mb-4 overflow-hidden">
                                {profile.gallery.length > 0 ? (
                                    <img src={profile.gallery[0].mediaUrl || ''} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <span className="text-2xl text-stone-400">✦</span>
                                )}
                            </div>
                            <h3 className="font-serif text-lg text-stone-900 mb-1">{profile.businessName}</h3>
                            <div className="flex justify-center gap-2 mb-6">
                                <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${profile.isVerified ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                                    {profile.isVerified ? 'Verified' : 'Pending'}
                                </span>
                            </div>

                            {/* Completeness */}
                            <div className="text-left w-full">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-stone-500">Profile Completion</span>
                                    <span className="text-stone-900 font-medium">{completenessPercent}%</span>
                                </div>
                                <div className="h-1 w-full bg-stone-100 mb-4">
                                    <div className="h-full bg-stone-900 transition-all duration-1000" style={{ width: `${completenessPercent}%` }} />
                                </div>
                                <ul className="space-y-2">
                                    {completenessItems.map((item) => (
                                        <li key={item.label} className="flex items-center gap-2 text-xs">
                                            <span className={item.done ? 'text-gold-500' : 'text-stone-200'}>●</span>
                                            <span className={item.done ? 'text-stone-600' : 'text-stone-400'}>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-stone-900 text-stone-400 p-6 text-sm">
                            <h4 className="text-stone-100 font-serif mb-2">Need Assistance?</h4>
                            <p className="mb-4">Contact our vendor support team for help with your profile.</p>
                            <Link href="#" className="flex items-center gap-2 text-gold-400 hover:text-gold-300">
                                Contact Support →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
