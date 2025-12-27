import { prisma } from '../config/database';

interface CreateTeamData {
    name: string;
    specialty: string;
    description?: string;
}

interface UpdateTeamData {
    name?: string;
    specialty?: string;
    description?: string;
}

/**
 * Create maintenance team
 */
export async function createTeam(data: CreateTeamData) {
    return await prisma.maintenanceTeam.create({
        data: {
            name: data.name,
            specialty: data.specialty,
            description: data.description,
        },
    });
}

/**
 * Get all teams
 */
export async function getAllTeams() {
    return await prisma.maintenanceTeam.findMany({
        include: {
            members: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                },
            },
            _count: {
                select: {
                    equipment: true,
                    requests: true,
                },
            },
        },
        orderBy: {
            name: 'asc',
        },
    });
}

/**
 * Get team by ID
 */
export async function getTeamById(id: string) {
    const team = await prisma.maintenanceTeam.findUnique({
        where: { id },
        include: {
            members: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    role: true,
                },
            },
            equipment: true,
            _count: {
                select: {
                    requests: true,
                },
            },
        },
    });

    if (!team) {
        throw new Error('Team not found');
    }

    return team;
}

/**
 * Update team
 */
export async function updateTeam(id: string, data: UpdateTeamData) {
    return await prisma.maintenanceTeam.update({
        where: { id },
        data,
        include: {
            members: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });
}

/**
 * Delete team
 */
export async function deleteTeam(id: string) {
    return await prisma.maintenanceTeam.delete({
        where: { id },
    });
}

/**
 * Add member to team
 */
export async function addTeamMember(teamId: string, userId: string) {
    // Verify user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Update user's team
    return await prisma.user.update({
        where: { id: userId },
        data: { teamId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            team: true,
        },
    });
}

/**
 * Remove member from team
 */
export async function removeTeamMember(teamId: string, userId: string) {
    // Verify user is in this team
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
            teamId: teamId,
        },
    });

    if (!user) {
        throw new Error('User is not a member of this team');
    }

    // Remove user from team
    return await prisma.user.update({
        where: { id: userId },
        data: { teamId: null },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    });
}
