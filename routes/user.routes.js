import express from 'express';
import { loginController, profileController, registerController, verifyOTPController } from '../controller/user.controller.js';
import { authentication } from '../middleware/user.middleware.js';

const router = express.Router();

router.post('/register',registerController)
router.post('/verify',verifyOTPController)

router.post('/login',loginController);

router.get('/profile',authentication,profileController);


export default router;