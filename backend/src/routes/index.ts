import { Router } from 'express';
import authRoutes from './authRoutes';
import equipmentRoutes from './equipmentRoutes';
import requestRoutes from './requestRoutes';
import teamRoutes from './teamRoutes';
import departmentRoutes from './departmentRoutes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/requests', requestRoutes);
router.use('/teams', teamRoutes);
router.use('/departments', departmentRoutes);

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'GearGuard API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
