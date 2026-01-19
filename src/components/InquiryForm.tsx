'use client';

import { useState } from 'react';
import { submitInquiry } from '@/app/actions/inquiry';

type InquiryFormProps = {
    vendorId: number;
    vendorName: string;
    occasions?: { id: number; name: string }[];
    onClose?: () => void;
};

export default function InquiryForm({ vendorId, vendorName, occasions = [], onClose }: InquiryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ success?: string; error?: string; details?: Record<string, string[]> } | null>(null);

    // Field-level validation states
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateField = (name: string, value: string) => {
        let error = '';

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    error = 'Name is required';
                } else if (value.trim().length < 2) {
                    error = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (value && !/^[\d\s+\-()]{10,}$/.test(value)) {
                    error = 'Please enter a valid phone number';
                }
                break;
            case 'message':
                if (!value.trim()) {
                    error = 'Message is required';
                } else if (value.trim().length < 10) {
                    error = 'Message must be at least 10 characters';
                }
                break;
        }

        return error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResult(null);

        const formData = new FormData(e.currentTarget);

        // Validate all fields before submitting
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const message = formData.get('message') as string;

        const newErrors: Record<string, string> = {
            name: validateField('name', name),
            email: validateField('email', email),
            phone: validateField('phone', phone),
            message: validateField('message', message),
        };

        setErrors(newErrors);
        setTouched({ name: true, email: true, phone: true, message: true });

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors) {
            setIsSubmitting(false);
            return;
        }

        const occasionIdStr = formData.get('occasionId') as string;
        const data = {
            vendorId,
            name,
            email,
            phone: phone || undefined,
            eventDate: (formData.get('eventDate') as string) || undefined,
            occasionId: occasionIdStr && occasionIdStr !== '' ? parseInt(occasionIdStr) : undefined,
            message,
        };

        const response = await submitInquiry(data);
        setResult(response);
        setIsSubmitting(false);

        if (response.success && onClose) {
            setTimeout(onClose, 2000);
        }
    };

    const getInputClass = (fieldName: string) => {
        const baseClass = "block w-full border-b py-2 text-stone-900 placeholder:text-stone-300 focus:outline-none transition-colors rounded-none";
        if (touched[fieldName] && errors[fieldName]) {
            return `${baseClass} border-red-400 focus:border-red-500`;
        }
        return `${baseClass} border-stone-200 focus:border-stone-900`;
    };

    return (
        <div className="bg-white border border-stone-200 p-8 shadow-card max-w-lg w-full">
            {/* Header - Minimal */}
            <div className="mb-8 border-l-2 border-stone-900 pl-4">
                <h3 className="text-2xl font-serif text-stone-900">
                    Get in Touch
                </h3>
                <p className="mt-1 text-sm text-stone-500 font-light">
                    Inquire with {vendorName}
                </p>
            </div>

            {/* Success Message */}
            {result?.success && (
                <div className="mb-6 p-4 bg-stone-50 border border-stone-200 text-stone-800 text-sm">
                    <span className="font-serif italic text-gold-600 block mb-1 text-lg">Thank you</span>
                    {result.success}
                </div>
            )}

            {/* Error Message */}
            {result?.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-800 text-sm">
                    {result.error}
                    {result.details && (
                        <ul className="mt-2 list-disc list-inside text-xs">
                            {Object.entries(result.details).map(([field, errors]) => (
                                <li key={field}>{(errors as string[]).join(', ')}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Form - Underline Inputs */}
            {!result?.success && (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label htmlFor="name" className="text-xs uppercase tracking-widest text-stone-400">
                                Your Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className={getInputClass('name')}
                                placeholder="Jane Doe"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {touched.name && errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs uppercase tracking-widest text-stone-400">
                                Email *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={getInputClass('email')}
                                placeholder="jane@example.com"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {touched.email && errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label htmlFor="phone" className="text-xs uppercase tracking-widest text-stone-400">
                                Phone
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className={getInputClass('phone')}
                                placeholder="+91 98765 43210"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {touched.phone && errors.phone && (
                                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="eventDate" className="text-xs uppercase tracking-widest text-stone-400">
                                Event Date
                            </label>
                            <input
                                id="eventDate"
                                name="eventDate"
                                type="date"
                                className="block w-full border-b border-stone-200 py-2 text-stone-900 placeholder:text-stone-300 focus:border-stone-900 focus:outline-none transition-colors rounded-none font-sans"
                            />
                        </div>
                    </div>

                    {occasions.length > 0 && (
                        <div className="space-y-1">
                            <label htmlFor="occasionId" className="text-xs uppercase tracking-widest text-stone-400">
                                Occasion
                            </label>
                            <select
                                id="occasionId"
                                name="occasionId"
                                className="block w-full border-b border-stone-200 py-2.5 text-stone-900 bg-transparent focus:border-stone-900 focus:outline-none transition-colors rounded-none cursor-pointer"
                            >
                                <option value="">Select Occasion</option>
                                {occasions.map((occ) => (
                                    <option key={occ.id} value={occ.id}>
                                        {occ.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="message" className="text-xs uppercase tracking-widest text-stone-400">
                            Message *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={3}
                            className={`${getInputClass('message')} resize-none`}
                            placeholder="Tell us about your plans..."
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        {touched.message && errors.message && (
                            <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-elegant mt-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                </form>
            )}
        </div>
    );
}
