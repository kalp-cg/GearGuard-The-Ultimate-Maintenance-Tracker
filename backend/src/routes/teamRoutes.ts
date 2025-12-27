import { Router } from 'express';
import * as teamController from '../controllers/teamController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Team CRUD
router.post('/', authorize('ADMIN', 'MANAGER'), teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.put('/:id', authorize('ADMIN', 'MANAGER'), teamController.updateTeam);
router.delete('/:id', authorize('ADMIN'), teamController.deleteTeam);

// Member management
router.post('/:id/members', authorize('ADMIN', 'MANAGER'), teamController.addTeamMember);
router.delete('/:id/members/:userId', authorize('ADMIN', 'MANAGER'), teamController.removeTeamMember);

export default router;
