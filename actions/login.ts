'use server';

import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { getUserByEmail } from '@/services/user';

/**
 * Handles user login with email and password.
 *
 * 1. Validates login fields against the schema.
 * 2. Ensures the user exists and has a verified email.
 * 3. If email is not verified, resend the verification token.
 * 4. Attempts to log in using the credentials provider.
 * 5. Handles errors such as invalid credentials or other Auth errors.
 *
 * @param values - Login form input containing email and password.
 * @returns An object with a success message, an error, or triggers a redirect.
 */
export const login = async (values: z.infer<typeof LoginSchema>) => {
  // client-side validation can be bypassed so add this to server, so user can't tamper with code
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  // user created/exists but not email verified yet, emailVerified should have a date
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: 'Confirmation email sent!' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }
    // add it so we redirect
    throw error;
  }

  return { success: 'Login Sucess!' };
};
