// Email configuration and sending utilities
// Note: For production, configure with a real email provider (Resend, SendGrid, etc.)

type EmailTemplate = {
    to: string;
    subject: string;
    html: string;
};

// Email templates
export function getInquiryNotificationEmail(data: {
    vendorName: string;
    customerName: string;
    customerEmail: string;
    occasion: string;
    eventDate: string | null;
    message: string;
}): EmailTemplate {
    return {
        to: '', // Will be set by the caller
        subject: `New Inquiry for ${data.vendorName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #9333ea, #ec4899); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">New Inquiry Received!</h1>
                </div>
                <div style="padding: 20px; background: #f9fafb;">
                    <p>Hello <strong>${data.vendorName}</strong>,</p>
                    <p>You have received a new inquiry from a potential customer:</p>
                    
                    <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                        <p><strong>From:</strong> ${data.customerName}</p>
                        <p><strong>Email:</strong> ${data.customerEmail}</p>
                        <p><strong>Occasion:</strong> ${data.occasion}</p>
                        ${data.eventDate ? `<p><strong>Event Date:</strong> ${data.eventDate}</p>` : ''}
                        <p><strong>Message:</strong></p>
                        <p style="background: #f3f4f6; padding: 12px; border-radius: 4px;">${data.message}</p>
                    </div>
                    
                    <p>Log in to your vendor dashboard to respond to this inquiry.</p>
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vendor/inquiries" 
                       style="display: inline-block; background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 12px;">
                        View Inquiry
                    </a>
                </div>
                <div style="padding: 16px; text-align: center; color: #6b7280; font-size: 12px;">
                    <p>EventsOnClick - Find the perfect vendors for your events</p>
                </div>
            </div>
        `,
    };
}

export function getReviewNotificationEmail(data: {
    vendorName: string;
    reviewerName: string;
    rating: number;
    comment: string | null;
}): EmailTemplate {
    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);

    return {
        to: '',
        subject: `New ${data.rating}-Star Review for ${data.vendorName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #9333ea, #ec4899); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">New Review!</h1>
                </div>
                <div style="padding: 20px; background: #f9fafb;">
                    <p>Hello <strong>${data.vendorName}</strong>,</p>
                    <p>You've received a new review:</p>
                    
                    <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
                        <p style="font-size: 24px; color: #f59e0b; margin: 0;">${stars}</p>
                        <p style="font-size: 18px; font-weight: bold; margin: 8px 0;">${data.rating} out of 5 stars</p>
                        <p style="color: #6b7280;">by ${data.reviewerName}</p>
                        ${data.comment ? `<p style="background: #f3f4f6; padding: 12px; border-radius: 4px; margin-top: 12px;">"${data.comment}"</p>` : ''}
                    </div>
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vendor/dashboard" 
                       style="display: inline-block; background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 12px;">
                        View Dashboard
                    </a>
                </div>
                <div style="padding: 16px; text-align: center; color: #6b7280; font-size: 12px;">
                    <p>EventsOnClick - Find the perfect vendors for your events</p>
                </div>
            </div>
        `,
    };
}

export function getVendorVerificationEmail(data: {
    vendorName: string;
    isVerified: boolean;
}): EmailTemplate {
    return {
        to: '',
        subject: data.isVerified
            ? `Congratulations! ${data.vendorName} is now verified`
            : `${data.vendorName} verification status update`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #9333ea, #ec4899); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">${data.isVerified ? '✓ Verified!' : 'Status Update'}</h1>
                </div>
                <div style="padding: 20px; background: #f9fafb;">
                    <p>Hello <strong>${data.vendorName}</strong>,</p>
                    ${data.isVerified
                ? `<p>Great news! Your vendor profile has been <strong style="color: #22c55e;">verified</strong> by our team.</p>
                           <p>Your business is now visible to all users on EventsOnClick. Start receiving inquiries from potential customers!</p>`
                : `<p>Your vendor profile verification status has been updated. Please log in to check the details.</p>`
            }
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/vendor/dashboard" 
                       style="display: inline-block; background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 12px;">
                        Go to Dashboard
                    </a>
                </div>
                <div style="padding: 16px; text-align: center; color: #6b7280; font-size: 12px;">
                    <p>EventsOnClick - Find the perfect vendors for your events</p>
                </div>
            </div>
        `,
    };
}

// Send email function (placeholder - integrate with actual email provider)
export async function sendEmail(template: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email would be sent:');
        console.log('  To:', template.to);
        console.log('  Subject:', template.subject);
        console.log('  (Email sending disabled in development)');
        return { success: true };
    }

    // Production: Integrate with email provider
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //     from: 'noreply@eventsonclick.com',
    //     to: template.to,
    //     subject: template.subject,
    //     html: template.html,
    // });

    console.log('📧 Email sent to:', template.to);
    return { success: true };
}
