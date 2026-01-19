'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { authenticate } from '@/app/actions/auth';

export default function LoginPage() {
    const [errorMessage, action, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="flex min-h-screen bg-off-white">
            {/* Left Side - Luxury Minimal Form */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24">
                <div className="mx-auto w-full max-w-sm">
                    {/* Logo - Serif */}
                    <Link href="/" className="inline-block mb-12">
                        <span className="text-3xl font-serif text-stone-900 tracking-tight">
                            Events<span className="italic text-stone-400">OnClick</span>
                        </span>
                    </Link>

                    <h2 className="text-3xl font-serif text-stone-900 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-stone-500 font-light mb-10">
                        Please sign in to access your account.
                    </p>

                    <form action={action} className="space-y-6">
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
                            <div className="flex justify-between">
                                <label htmlFor="password" className="block text-xs uppercase tracking-widest text-stone-500 font-medium">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs text-stone-400 hover:text-stone-900 transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full border-b border-stone-300 bg-transparent px-0 py-2.5 text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none transition-colors rounded-none"
                                placeholder="••••••••"
                            />
                        </div>

                        {errorMessage && (
                            <div className="p-4 bg-red-50 border border-red-100 text-sm text-red-600">
                                {errorMessage}
                            </div>
                        )}

                        <div className="pt-6 text-center text-sm font-medium text-stone-500">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-stone-900 underline decoration-stone-300 hover:decoration-stone-900 underline-offset-4 transition-all">
                                Create Account
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full btn-elegant mt-4"
                        >
                            {isPending ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - Editorial Image/Panel */}
            <div className="hidden lg:flex lg:flex-1 bg-stone-900 relative overflow-hidden items-center justify-center p-12 text-center text-stone-50">
                <div className="relative z-10 max-w-lg">
                    <span className="text-gold-400 font-serif italic text-2xl mb-4 block">Excellence in Events</span>
                    <h3 className="text-4xl font-serif text-white mb-6 leading-tight">
                        "The details are not the details. <br /> They make the design."
                    </h3>
                    <div className="w-12 h-px bg-stone-700 mx-auto mb-6"></div>
                    <p className="text-stone-400 font-light">
                        Join the community of premier vendors and discerning planners.
                    </p>
                </div>

                {/* Subtle Grain/Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
            </div>
        </div>
    );
}
