import { Request, Response } from 'express';
import * as teamService from '../services/teamService';

/**
 * Create maintenance team
 */
export async function createTeam(req: Request, res: Response): Promise<void> {
    try {
        const team = await teamService.createTeam(req.body);

        res.status(201).json({
            message: 'Team created successfully',
            team,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Get all teams
 */
export async function getAllTeams(req: Request, res: Response): Promise<void> {
    try {
        const teams = await teamService.getAllTeams();

        res.status(200).json({ teams });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Get team by ID
 */
export async function getTeamById(req: Request, res: Response): Promise<void> {
    try {
        const team = await teamService.getTeamById(req.params.id);

        res.status(200).json({ team });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

/**
 * Update team
 */
export async function updateTeam(req: Request, res: Response): Promise<void> {
    try {
        const team = await teamService.updateTeam(req.params.id, req.body);

        res.status(200).json({
            message: 'Team updated successfully',
            team,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Delete team
 */
export async function deleteTeam(req: Request, res: Response): Promise<void> {
    try {
        await teamService.deleteTeam(req.params.id);

        res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Add team member
 */
export async function addTeamMember(req: Request, res: Response): Promise<void> {
    try {
        const { userId } = req.body;

        const user = await teamService.addTeamMember(req.params.id, userId);

        res.status(200).json({
            message: 'Member added to team successfully',
            user,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Remove team member
 */
export async function removeTeamMember(req: Request, res: Response): Promise<void> {
    try {
        const user = await teamService.removeTeamMember(req.params.id, req.params.userId);

        res.status(200).json({
            message: 'Member removed from team successfully',
            user,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
