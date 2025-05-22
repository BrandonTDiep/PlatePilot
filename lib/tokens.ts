
import { v4 as uuidv4 } from "uuid"
import { db } from "@/lib/db"
import { getVerficationTokenByEmail } from "@/services/verfication-token"
import { getPasswordResetTokenByEmail } from "@/services/password-reset-token"

/**
 * Generates a new email verification token for a given email address.
 * Deletes any existing token before creating a new one.
 * 
 * @param email - The user's email address
 * @returns The created verification token
 */
export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // expires in 1 hr

    const existingToken = await getVerficationTokenByEmail(email)

    if(existingToken) {
        await db.verificationToken.delete({
            where : {
                id: existingToken.id
            }
        })
    }
    // creates a token with email, token, expires
    const verificationToken = await db.verificationToken.create({
        data: {
            email, 
            token,
            expires
        }
    })

    return verificationToken

}


/**
 * Generates a new password reset token for a given email address.
 * Deletes any existing token before creating a new one.
 * 
 * @param email - The user's email address
 * @returns The created password reset token
 */
export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)

    if(existingToken) {
        await db.passwordResetToken.delete({
            where : {
                id: existingToken.id
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email, 
            token,
            expires
        }
    })

    return passwordResetToken

}
