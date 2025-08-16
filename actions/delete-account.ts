'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
/**
 * Deletes the current user's account.
 *
 * 1. Checks if the user is authenticated.
 * 2. Deletes the user from the database.
 * 3. Signs out the user.
 *
 * @returns An object with either a success message or an error.
 */
export const deleteAccount = async () => {
  const user = await currentUser();
  console.log('DETELE', user);

  if (!user) {
    return { error: 'Unauthorized!' };
  }

  await db.user.delete({
    where: { id: user.id },
  });

  return { success: 'Account deleted successfully!' };
};
