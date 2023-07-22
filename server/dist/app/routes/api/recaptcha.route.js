import express from 'express';
import recaptchaCtrl from '../../controllers/recaptcha.controller.js';
const router = express.Router();
router.route('/').post(recaptchaCtrl.verify);
export default router;
//# sourceMappingURL=recaptcha.route.js.map