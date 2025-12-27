import { Router } from 'express';
import * as partController from '../controllers/partController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Part CRUD
router.post('/', authorize('ADMIN', 'MANAGER'), partController.createPart);
router.get('/', partController.getAllParts);
router.get('/:id', partController.getPartById);
router.put('/:id', authorize('ADMIN', 'MANAGER'), partController.updatePart);
router.delete('/:id', authorize('ADMIN'), partController.deletePart);

export default router;
