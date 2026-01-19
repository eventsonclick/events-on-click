'use client';

import { useState } from 'react';
import { submitReview } from '@/app/actions/review';

type Props = {
    vendorId: number;
    vendorName: string;
    isLoggedIn: boolean;
};

export default function ReviewForm({ vendorId, vendorName, isLoggedIn }: Props) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    if (!isLoggedIn) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResult(null);

        const response = await submitReview({ vendorId, rating, comment });
        setResult(response);
        setIsSubmitting(false);

        if (response.success) {
            setComment('');
            setRating(5);
            setTimeout(() => setIsOpen(false), 2000);
        }
    };

    return (
        <div className="mt-6">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
                >
                    Write a Review
                </button>
            ) : (
                <div className="rounded-xl border bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Rate {vendorName}
                    </h3>

                    {result?.success && (
                        <div className="mt-4 rounded-lg bg-green-50 p-3 text-green-700">
                            {result.success}
                        </div>
                    )}

                    {result?.error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
                            {result.error}
                        </div>
                    )}

                    {!result?.success && (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Rating
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-3xl transition ${star <= rating ? 'text-amber-400' : 'text-gray-300'
                                                } hover:scale-110`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                                    Your Review (optional)
                                </label>
                                <textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Share your experience..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
