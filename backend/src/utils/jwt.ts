import jwt from 'jsonwebtoken';
import config from '../config';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Generate Password Reset Token
 */
export function generateResetToken(userId: string): string {
    return jwt.sign({ userId, type: 'reset' }, config.jwt.secret, {
        expiresIn: `${config.email.otpExpiresIn}m`,
    } as jwt.SignOptions);
}

/**
 * Verify Reset Token
 */
export function verifyResetToken(token: string): { userId: string; type: string } {
    try {
        return jwt.verify(token, config.jwt.secret) as { userId: string; type: string };
    } catch (error) {
        throw new Error('Invalid or expired reset token');
    }
}
