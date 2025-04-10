"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"
import { SignUpSchema } from "@/schemas"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/services/user"

export const signup = async(values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, name } = validatedFields.data

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  // TODO: Send verification token email

  return { success: "User Created!" }
}

