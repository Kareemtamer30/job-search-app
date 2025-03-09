import {Router} from 'express';
import * as chatService from './chat.services.js';
import {authenticate} from "../../middlewares/authentication.js";
const router = Router();


router.get('/chat/history/:userId', authenticate, chatService.getChatHistory);
export default router;