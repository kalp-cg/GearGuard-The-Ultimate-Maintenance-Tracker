import { Request, Response } from 'express';
import * as partService from '../services/partService';

/**
 * Create part
 */
export async function createPart(req: Request, res: Response): Promise<void> {
    try {
        const part = await partService.createPart(req.body);
        res.status(201).json({
            message: 'Part created successfully',
            part
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Get all parts
 */
export async function getAllParts(req: Request, res: Response): Promise<void> {
    try {
        const parts = await partService.getAllParts();
        res.status(200).json({ parts });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get part by ID
 */
export async function getPartById(req: Request, res: Response): Promise<void> {
    try {
        const part = await partService.getPartById(req.params.id);
        res.status(200).json({ part });
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
}

/**
 * Update part
 */
export async function updatePart(req: Request, res: Response): Promise<void> {
    try {
        const part = await partService.updatePart(req.params.id, req.body);
        res.status(200).json({
            message: 'Part updated successfully',
            part
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

/**
 * Delete part
 */
export async function deletePart(req: Request, res: Response): Promise<void> {
    try {
        await partService.deletePart(req.params.id);
        res.status(200).json({ message: 'Part deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
