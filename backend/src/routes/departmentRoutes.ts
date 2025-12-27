import { Router } from 'express';
import * as departmentController from '../controllers/departmentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Department CRUD
router.post('/', authorize('ADMIN'), departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.put('/:id', authorize('ADMIN'), departmentController.updateDepartment);
router.delete('/:id', authorize('ADMIN'), departmentController.deleteDepartment);

export default router;
