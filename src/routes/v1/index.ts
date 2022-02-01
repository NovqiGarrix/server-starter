import { Router } from 'express';

import AuthRoute from './AuthRoute';
import UserRoute from './UserRoute';

import { authenticationMiddleware } from '../../middleware';

const router = Router();

router.use('/auth', AuthRoute);

router.use('/user', authenticationMiddleware, UserRoute);

export default router