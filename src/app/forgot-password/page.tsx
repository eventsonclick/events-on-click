import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Left - Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    <Link href="/" className="text-2xl font-serif text-stone-900 block mb-12">
                        Events<span className="text-gold-600">OnClick</span>
                    </Link>

                    <h1 className="text-3xl font-serif text-stone-900 mb-2">
                        Reset Password
                    </h1>
                    <p className="text-stone-500 font-light mb-8">
                        Enter your email and we'll send you a link to reset your password.
                    </p>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest text-stone-500 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full border-b border-stone-300 bg-transparent py-3 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-stone-900 text-white py-4 font-medium uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors"
                        >
                            Send Reset Link
                        </button>

                        <p className="text-center text-sm text-stone-500">
                            Remember your password?{' '}
                            <Link href="/login" className="text-stone-900 underline underline-offset-4 hover:text-gold-600">
                                Sign in
                            </Link>
                        </p>
                    </form>

                    {/* Info Message */}
                    <div className="mt-8 p-4 bg-stone-100 border border-stone-200 text-sm text-stone-600">
                        <p className="font-medium text-stone-900 mb-1">📧 Email Reset Coming Soon</p>
                        <p className="font-light">
                            Password reset via email is being configured. For now, please contact support if you need to reset your password.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-stone-900 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <span className="text-6xl mb-6 block">🔐</span>
                    <h2 className="text-3xl font-serif text-stone-100 mb-4">
                        Account Security
                    </h2>
                    <p className="text-stone-400 font-light">
                        Your account security is important to us. We use secure tokens to verify password reset requests.
                    </p>
                </div>
            </div>
        </div>
    );
}
