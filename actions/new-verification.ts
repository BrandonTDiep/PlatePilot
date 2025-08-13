'use server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/services/user';
import { getVerficationToken } from '@/services/verfication-token';

/**
 * Handles email verification using a provided token.
 *
 * 1. Checks if the token exists and is valid.
 * 2. Verifies the token hasn't expired.
 * 3. Confirms the associated user exists.
 * 4. Updates the user's `emailVerified` field and optionally updates the email.
 * 5. Deletes the used verification token from the database.
 *
 * @param token - The verification token sent to the user's email.
 * @returns An object indicating success or an appropriate error message.
 */
export const newVerification = async (token: string) => {
  // contains email, token, expires
  const existingToken = await getVerficationToken(token);

  if (!existingToken) {
    return { error: 'Token does not exist!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }
  // update email in case user wants to modify their email (settings page), simply create a token with that new email and send an email to that email
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // no need to store in db anymore
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified!' };
};
