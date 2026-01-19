'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';

export default function SignupPage() {
    const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const rawData = Object.fromEntries(formData.entries());
        const result = await registerUser(rawData as any);
        return result;
    }, undefined);

    return (
        <div className="flex min-h-screen bg-off-white">
            {/* Left Side - Editorial Panel */}
            <div className="hidden lg:flex lg:flex-1 bg-stone-900 relative overflow-hidden items-center justify-center p-12 text-center text-stone-50">
                <div className="relative z-10 max-w-lg">
                    <span className="text-gold-400 font-serif italic text-2xl mb-4 block">Begin Your Journey</span>
                    <h3 className="text-4xl font-serif text-white mb-6 leading-tight">
                        "Curating moments that <br /> last a lifetime."
                    </h3>
                    <div className="w-12 h-px bg-stone-700 mx-auto mb-6"></div>
                    <p className="text-stone-400 font-light">
                        Join our exclusive community of event planners and vendors.
                    </p>
                </div>

                {/* Texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
            </div>

            {/* Right Side - Luxury Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24">
                <div className="mx-auto w-full max-w-sm">
                    {/* Logo */}
                    <Link href="/" className="inline-block mb-12">
                        <span className="text-3xl font-serif text-stone-900 tracking-tight">
                            Events<span className="italic text-stone-400">OnClick</span>
                        </span>
                    </Link>

                    <h2 className="text-3xl font-serif text-stone-900 mb-2">
                        Create Account
                    </h2>
                    <p className="text-stone-500 font-light mb-10">
                        Join us to access exclusive features.
                    </p>

                    <form action={action} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="fullName" className="block text-xs uppercase tracking-widest text-stone-500 font-medium">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="block w-full border-b border-stone-300 bg-transparent px-0 py-2.5 text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none transition-colors rounded-none"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-stone-500 font-medium">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full border-b border-stone-300 bg-transparent px-0 py-2.5 text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none transition-colors rounded-none"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="mobileNumber" className="block text-xs uppercase tracking-widest text-stone-500 font-medium">
                                    Mobile Number <span className="normal-case text-stone-300 italic">(Optional)</span>
                                </label>
                                <input
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    type="tel"
                                    className="block w-full border-b border-stone-300 bg-transparent px-0 py-2.5 text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none transition-colors rounded-none"
                                    placeholder="+1 234 567 890"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-xs uppercase tracking-widest text-stone-500 font-medium">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full border-b border-stone-300 bg-transparent px-0 py-2.5 text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none transition-colors rounded-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-sm text-red-600">
                                <p className="font-medium mb-1">Registration Failed</p>
                                <p>{state.error}</p>
                            </div>
                        )}

                        {state?.success && (
                            <div className="p-4 bg-stone-50 border border-stone-200 text-sm text-stone-800">
                                <span className="font-serif italic text-gold-600 block mb-1 text-lg">Success</span>
                                {state.success}
                                <Link href="/login" className="block mt-2 underline decoration-stone-300 hover:decoration-stone-900 underline-offset-4">
                                    Sign in now
                                </Link>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full btn-elegant"
                            >
                                {isPending ? 'Creating Account...' : 'Sign Up'}
                            </button>

                            <div className="mt-6 text-center text-sm font-medium text-stone-500">
                                Already have an account?{' '}
                                <Link href="/login" className="text-stone-900 underline decoration-stone-300 hover:decoration-stone-900 underline-offset-4 transition-all">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
