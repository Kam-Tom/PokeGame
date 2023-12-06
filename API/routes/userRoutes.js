import express from 'express';
import * as controller from '../controllers/userController.js';
import {authenticateToken} from '../services/token.js';
const router = express.Router();

router.post("/login", controller.login);
router.post('/register', controller.register);
router.get('/',authenticateToken, controller.getGameData);
router.delete("/",authenticateToken, controller.deleteUser);

export default router;