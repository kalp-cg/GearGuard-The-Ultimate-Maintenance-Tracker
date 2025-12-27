import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

/**
 * Team authorization middleware
 * Ensures user is a member of the team associated with the request
 */
export async function validateTeamAccess(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        // Admins bypass team checks
        if (req.user.role === 'ADMIN') {
            next();
            return;
        }

        const requestId = req.params.id;

        // Get the maintenance request with team info
        const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
            where: { id: requestId },
            include: {
                team: {
                    include: {
                        members: {
                            select: { id: true },
                        },
                    },
                },
            },
        });

        if (!maintenanceRequest) {
            res.status(404).json({ error: 'Maintenance request not found' });
            return;
        }

        // Check if user is a member of the team
        const isMember = maintenanceRequest.team.members.some(
            (member) => member.id === req.user!.id
        );

        if (!isMember) {
            res.status(403).json({
                error: 'Access denied. You are not a member of this maintenance team.'
            });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Failed to validate team access' });
    }
}
