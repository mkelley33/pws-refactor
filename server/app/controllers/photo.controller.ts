import fs from 'fs-extra';
import sharp from 'sharp';

import Photo from '../models/photo.model.js';
import PhotoAlbum from '../models/photo-album.model.js';
import { Request, Response, NextFunction } from 'express';
import APIError from '../helpers/APIError.js';
import { UploadedFile } from 'express-fileupload';

function makeThumbs(dirPath: string, filePath: string, fileName: string) {
  const thumbsDir = `${dirPath}/thumbs`;
  fs.ensureDir(thumbsDir).then(() => {
    const thumbFilePath = `${thumbsDir}/${fileName}`;
    sharp(filePath).resize(400).toFile(thumbFilePath);
  });
}

function upload(req: Request, res: Response, next: NextFunction) {
  if (!req.files) throw new APIError('There was no file uploaded.');
  const imageFile: UploadedFile | UploadedFile[] = req.files.file;
  const fileName = Array.isArray(imageFile) ? new APIError('You may only upload one image at a time') : imageFile.name;
  if (['image/jpeg', 'image/png'].includes((imageFile as UploadedFile).mimetype)) {
    const { userId, albumId } = req.body;
    const dirPath = `${__dirname}/../../public/images/${userId}/`;
    const filePath = `${dirPath}${fileName}`;
    fs.ensureDir(dirPath).then(() => {
      // TODO: Allow multiple images to be uploaded.
      if (Array.isArray(imageFile)) throw new APIError('You may only upload one image at a time.');
      imageFile.mv(filePath, async function (err: APIError) {
        if (err) return res.status(500).send(err);
        makeThumbs(dirPath, filePath, fileName as string);
        const photo = await new Photo({ filename: fileName, userId: req.body.userId }).save();
        // TODO: Make the new photo and photo album uploaded transactional. If one fails, make sure both are deleted.
        if (albumId) {
          PhotoAlbum.findOneAndUpdate({ _id: req.body.albumId }, { $push: { photos: photo } }, (err: Error) => {
            if (err) return next(err);
          });
        }
        return res.status(200).json({ file: `public/images/${userId}/${fileName}` });
      });
    });
  } else {
    res.status(415).json({ errors: { file: 'The image must be a jpeg or png.' } });
  }
}

async function list(req: Request, res: Response, next: NextFunction) {
  // By default get only photos by user
  // If params are for shared, get shared photos
  const { skip, limit } = req.query;
  const photos = Photo.findPaginated(
    { userId: res.locals.authorizedData.userId },
    { skip: parseFloat(skip), limit: parseFloat(limit), sort: '-createdAt' }
  );
}

function deletePhoto(req: Request, res: Response, next: NextFunction) {
  Photo.findByIdAndDelete(req.params.id).then((photo: any) => {
    if (photo) {
      fs.unlink(`${__dirname}/../../public/images/${res.locals.authorizedData.userId}/${photo.filename}`, (err) => {
        if (err) next(err);
        fs.unlink(
          `${__dirname}/../../public/images/${res.locals.authorizedData.userId}/thumbs/${photo.filename}`,
          (err) => {
            if (err) next(err);
            PhotoAlbum.updateMany({}, { $pull: { photos: { _id: photo._id } } }).then((_data: any) => {
              return res.json({ success: true });
            });
          }
        );
      });
    } else {
      throw new APIError(`Could not find photo with id ${req.params.id}, thus it was not deleted.`);
    }
  });
}

export default { upload, list, deletePhoto };
