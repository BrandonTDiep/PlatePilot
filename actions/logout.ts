'use server';

import { signOut } from '@/auth';

export const logout = async () => {
  // some server stuff here if needed
  // e.g., logging the logout event, cleaning up session data, etc.
  await signOut();
};