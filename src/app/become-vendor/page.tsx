import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getVendorProfile } from '@/lib/data';
import { becomeVendor } from '@/app/actions/vendor';

export default async function BecomeVendorPage() {
    const session = await auth();

    // If not logged in, redirect to login
    if (!session?.user?.id) {
        redirect('/login');
    }

    // Check if already a vendor
    const existingProfile = await getVendorProfile(parseInt(session.user.id));
    if (existingProfile) {
        redirect('/vendor/dashboard');
    }

    return (
        <div className="min-h-screen bg-off-white">
            {/* Editorial Hero */}
            <section className="relative px-6 py-24 lg:py-32 bg-stone-900 text-stone-50 overflow-hidden">
                <div className="container-wide relative z-10 text-center">
                    <span className="text-sm font-medium tracking-[0.2em] text-gold-400 uppercase mb-6 block">
                        Partner With Us
                    </span>
                    <h1 className="text-5xl lg:text-7xl font-serif leading-tight mb-8">
                        Elevate Your <br className="hidden md:block" /> Event Business
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-stone-400 font-light mb-12">
                        Join a curated network of premier vendors. Connect with clients who value quality, style, and excellence.
                    </p>

                    <form action={async () => {
                        'use server';
                        await becomeVendor();
                    }}>
                        <button
                            type="submit"
                            className="bg-white text-stone-900 px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-gold-50 transition-colors"
                        >
                            Create Your Portfolio
                        </button>
                    </form>
                    <p className="mt-4 text-xs text-stone-500 uppercase tracking-wider">
                        Free Listing • Setup in Minutes
                    </p>
                </div>

                {/* Background Art */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-stone-800 to-transparent opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-linear-to-r from-stone-800 to-transparent opacity-30"></div>
            </section>

            {/* Benefits Grid */}
            <section className="px-6 py-24 container-wide">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[
                        {
                            num: '01',
                            title: 'Curated Exposure',
                            desc: 'Showcase your work to a discerning audience looking for quality vendors.',
                        },
                        {
                            num: '02',
                            title: 'Direct Connection',
                            desc: 'Receive inquiries directly from clients. No barriers, just business.',
                        },
                        {
                            num: '03',
                            title: 'Build Trust',
                            desc: 'Collect verified reviews to establish your reputation as a top-tier provider.',
                        },
                        {
                            num: '04',
                            title: 'Smart Analytics',
                            desc: 'Gain insights into your profile performance and customer engagement.',
                        },
                        {
                            num: '05',
                            title: 'Visual Portfolio',
                            desc: 'A beautiful, magazine-style profile to display your best work.',
                        },
                        {
                            num: '06',
                            title: 'Verified Status',
                            desc: 'Earn the verified badge to stand out as a trusted professional.',
                        },
                    ].map((item) => (
                        <div key={item.num} className="group hover:-translate-y-1 transition-transform duration-500">
                            <span className="text-4xl font-serif text-gold-200 group-hover:text-gold-400 transition-colors block mb-4 italic">
                                {item.num}
                            </span>
                            <h3 className="text-xl font-serif text-stone-900 mb-3">{item.title}</h3>
                            <p className="text-stone-500 font-light leading-relaxed border-l border-stone-200 pl-4 group-hover:border-gold-400 transition-colors">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quote / CTA */}
            <section className="bg-white border-y border-stone-100 px-6 py-24 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif italic text-stone-900 mb-8">
                        "The platform for professionals who define excellence."
                    </h2>
                    <form action={async () => {
                        'use server';
                        await becomeVendor();
                    }}>
                        <button
                            type="submit"
                            className="btn-elegant"
                        >
                            Start Your Journey
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
