import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Header() {
    const session = await auth();
    const isLoggedIn = !!session?.user?.id;

    // @ts-ignore - roleId is added in session callback
    const roleId = session?.user?.roleId;
    const isVendor = roleId === 2;
    const isAdmin = roleId === 1;

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-stone-100">
            <div className="container-wide flex items-center justify-between h-20">
                {/* Logo - Serif & Minimal */}
                <Link href="/" className="group flex items-center gap-1">
                    <span className="text-2xl font-serif text-stone-900 tracking-tight">
                        Events<span className="italic text-stone-500 font-light group-hover:text-gold-500 transition-colors">OnClick</span>
                    </span>
                </Link>

                {/* Navigation - Uppercase & Clean */}
                <nav className="hidden items-center gap-8 md:flex">
                    {!isVendor && !isAdmin && (
                        <Link
                            href="/vendors"
                            className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                        >
                            Browse Vendors
                        </Link>
                    )}
                    {isVendor && (
                        <>
                            <Link href="/vendor/dashboard" className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/vendor/inquiries" className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
                                Inquiries
                            </Link>
                            <Link href="/vendor/analytics" className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
                                Analytics
                            </Link>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <Link href="/admin" className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/admin/reviews" className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors">
                                Reviews
                            </Link>
                        </>
                    )}
                </nav>

                {/* Auth Section - Minimal Buttons */}
                <div className="flex items-center gap-6">
                    {isLoggedIn ? (
                        <>
                            {/* User Info */}
                            <div className="hidden items-center gap-3 sm:flex">
                                <div className="text-right">
                                    <div className="text-sm font-medium text-stone-900 font-serif">
                                        {session.user?.name || 'User'}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-wider text-stone-400">
                                        {isAdmin ? 'Admin' : isVendor ? 'Vendor' : 'Member'}
                                    </div>
                                </div>
                            </div>

                            {!isVendor && !isAdmin && (
                                <Link
                                    href="/become-vendor"
                                    className="hidden text-xs font-medium uppercase tracking-widest text-gold-600 hover:text-gold-700 sm:block border border-gold-200 px-4 py-2 hover:bg-gold-50 transition-colors"
                                >
                                    List Business
                                </Link>
                            )}

                            <form action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}>
                                <button className="text-xs font-medium uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                                    Sign Out
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="bg-stone-900 text-white px-5 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
