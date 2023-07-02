import express from 'express';
import photoAlbumCtrl from '../../controllers/photo-album.controller.js';
import withAuthentication, { withAuthenticationAndRole } from '../../middlewares/with-authentication.js';

const router = express.Router();

router.route('/').post(withAuthentication, photoAlbumCtrl.create);

router.route('/').get(withAuthentication, photoAlbumCtrl.list);

router.route('/:id').get(withAuthentication, photoAlbumCtrl.get);

router.route('/:id').delete(withAuthentication, photoAlbumCtrl.deleteAlbum);

export default router;
