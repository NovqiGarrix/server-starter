import { Router } from 'express';

import { login, register } from '../../controller/auth.controller';
import { loginRequestParse, registerRequestParse } from '../../middleware/authRouteMiddeware';

const router = Router();

router.get('/', (req, res) => res.sendStatus(201));

router.post('/', [loginRequestParse], login);
router.post('/signUp', [registerRequestParse], register);

export default router