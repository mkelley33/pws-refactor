import express from 'express';
import contactCtrl from '../../controllers/contact.controller.js';

const router = express.Router();

router.route('/').post(contactCtrl.contact);

export default router;
