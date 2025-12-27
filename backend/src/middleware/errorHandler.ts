import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Global error handler middleware
 */
export function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error('Error:', error);

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                // Unique constraint violation
                res.status(409).json({
                    error: 'A record with this value already exists',
                    field: error.meta?.target,
                });
                return;

            case 'P2025':
                // Record not found
                res.status(404).json({
                    error: 'Record not found',
                });
                return;

            case 'P2003':
                // Foreign key constraint violation
                res.status(400).json({
                    error: 'Invalid reference to related record',
                });
                return;

            default:
                res.status(400).json({
                    error: 'Database operation failed',
                    code: error.code,
                });
                return;
        }
    }

    // Validation errors
    if (error.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation failed',
            details: error.details,
        });
        return;
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            error: 'Invalid token',
        });
        return;
    }

    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            error: 'Token expired',
        });
        return;
    }

    // Default error
    res.status(error.status || 500).json({
        error: error.message || 'Internal server error',
    });
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(
    req: Request,
    res: Response
): void {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    });
}
