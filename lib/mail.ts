import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
/**
 * Sends a verification email with a confirmation link to the provided email address.
 *
 * @param email - The recipient's email address.
 * @param token - The unique generated verification token to be included in the confirmation link.
 *
 * The confirmation link directs the user to the frontend route where token validation occurs.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  // link to check whether token has expired or whether it exists, change to dynamic
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

/**
 * Sends a password reset email with a secure link to the provided email address.
 *
 * @param email - The recipient's email address.
 * @param token - The unique generated password reset token to be included in the reset link.
 *
 * The reset link allows the user to set a new password after verifying the token.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};
