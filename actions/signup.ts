'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { SignUpSchema } from '@/schemas';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/services/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

/**
 * Handles user registration by validating input, checking for existing users,
 * hashing the password, creating the user in the database, and sending a verification email.
 *
 * @param values - The input object containing name, email, and password.
 * @returns An object indicating success or an appropriate error message.
 */
export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  // generate verification token
  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};
