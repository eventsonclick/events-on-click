'use client';

import { useState } from 'react';
import { updateInquiryStatus } from '@/app/actions/inquiry';

type Inquiry = {
    id: number;
    message: string | null;
    eventDate: Date | null;
    status: string;
    createdAt: Date;
    user: { fullName: string | null; email: string; mobileNumber: string | null } | null;
    occasion: { name: string } | null;
};

type Props = {
    inquiries: Inquiry[];
};

const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    CONVERTED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-600',
};

export default function InquiriesList({ inquiries }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleStatusChange = async (id: number, status: string) => {
        setUpdatingId(id);
        await updateInquiryStatus(id, status);
        setUpdatingId(null);
    };

    if (inquiries.length === 0) {
        return (
            <div className="mt-8 rounded-xl border bg-white p-12 text-center">
                <div className="text-6xl">💬</div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No inquiries yet</h3>
                <p className="mt-2 text-gray-500">
                    When customers send inquiries, they'll appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            {inquiries.map((inquiry) => (
                <div
                    key={inquiry.id}
                    className="rounded-xl border bg-white overflow-hidden"
                >
                    {/* Header */}
                    <div
                        className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
                        onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                                {inquiry.user?.fullName?.[0] || '?'}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">
                                    {inquiry.user?.fullName || 'Guest'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {inquiry.occasion?.name || 'General Inquiry'}
                                    {inquiry.eventDate && ` • ${new Date(inquiry.eventDate).toLocaleDateString()}`}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[inquiry.status] || 'bg-gray-100'}`}>
                                {inquiry.status}
                            </span>
                            <span className="text-sm text-gray-400">
                                {new Date(inquiry.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-gray-400">
                                {expandedId === inquiry.id ? '▲' : '▼'}
                            </span>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === inquiry.id && (
                        <div className="border-t bg-gray-50 p-4">
                            {/* Message */}
                            <div className="rounded-lg bg-white p-4">
                                <div className="text-sm font-medium text-gray-500 mb-2">Message</div>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {inquiry.message || 'No message provided.'}
                                </p>
                            </div>

                            {/* Contact Info */}
                            {inquiry.user && (
                                <div className="mt-4 flex gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Email:</span>{' '}
                                        <a href={`mailto:${inquiry.user.email}`} className="text-purple-600 hover:underline">
                                            {inquiry.user.email}
                                        </a>
                                    </div>
                                    {inquiry.user.mobileNumber && (
                                        <div>
                                            <span className="text-gray-500">Phone:</span>{' '}
                                            <a href={`tel:${inquiry.user.mobileNumber}`} className="text-purple-600 hover:underline">
                                                {inquiry.user.mobileNumber}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Status Actions */}
                            <div className="mt-4 flex gap-2">
                                <span className="text-sm text-gray-500 py-2">Update status:</span>
                                {['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(inquiry.id, s)}
                                        disabled={updatingId === inquiry.id || inquiry.status === s}
                                        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${inquiry.status === s
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            } disabled:opacity-50`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
