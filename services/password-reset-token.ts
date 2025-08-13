import { db } from '@/lib/db';

/**
 * Fetches the password reset token record from the database using the token string.
 *
 * @param token - The password reset token to look up.
 * @returns The password reset token record if found, otherwise null.
 */
export const getPasswordResetToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

/**
 * Fetches the password reset token record associated with a given email. Used to check if existing token.
 *
 * @param email - The email address to look up a password reset token for.
 * @returns The password reset token record if found, otherwise null.
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
