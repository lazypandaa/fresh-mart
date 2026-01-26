import { Router } from 'express';
import { sendRegistrationEmail, sendGenericEmail } from '../controllers/email.controller';

const router = Router();

router.post('/registration', sendRegistrationEmail);
router.post('/send', sendGenericEmail);

export default router;