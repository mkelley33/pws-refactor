import busboy, { BusboyConfig } from 'busboy';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';
import logger from '../../config/winston.js';
import Photo from '../models/photo.model.js';
import PhotoAlbum from '../models/photo-album.model.js';
import { Request, Response, NextFunction } from 'express';

import APIError from '../helpers/APIError.js';
import config from '../../config/env/index.js';

const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';
const isTest = env === 'test';
dotenv.config(getConfigPath());

function getConfigPath() {
  if (isDevelopment) {
    return { path: './.env.development' };
  } else if (isTest) {
    return { path: './.env.test' };
  } else {
    return { path: './.env' };
  }
}

function makeThumbs(dirPath: string, filePath: string, fileName: string) {
  const thumbsDir = `${dirPath}/thumbs`;
  fs.ensureDir(thumbsDir).then(() => {
    const thumbFilePath = `${thumbsDir}/${fileName}`;
    sharp(filePath).resize(400).toFile(thumbFilePath);
  });
}

function upload(req: Request, res: Response, next: NextFunction) {
  const busboyConfig: BusboyConfig = {
    headers: req.headers,
    limits: { fileSize: config.fileSizeLimit },
  };
  const busboyConfigured = busboy(busboyConfig);
  busboyConfigured.on(
    'file',
    function (fieldname: string, file: any, filename: string, encoding: string, mimetype: string): void {
      // TODO: Allow multiple images to be uploaded.
      logger.info(`Uploading - fieldname is ${fieldname}`);
      logger.info(`Uploading - file ${JSON.stringify(file)}`);
      logger.info(`Uploading - filename ${filename}`);
      logger.info(`Uploading - encoding ${encoding}`);
      logger.info(`Uploading - mimetype ${mimetype}`);

      if (['image/jpeg', 'image/png'].includes(mimetype)) {
        const { userId, albumId } = req.body;
        const dirPath = `${__dirname}/../../public/images/${userId}/`;
        const filePath = `${dirPath}${filename}`;
        file.pipe(fs.createWriteStream(filePath));
        fs.ensureDir(dirPath).then(() => {
          file.mv(filePath, async function (err: APIError) {
            if (err) return res.status(500).send(err);
            makeThumbs(dirPath, filePath, filename);
            const photo = await new Photo({ filename: filename, userId: req.body.userId }).save();
            if (albumId) {
              PhotoAlbum.findOneAndUpdate({ _id: req.body.albumId }, { $push: { photos: photo } }, (err: Error) => {
                if (err) return next(err);
              });
              return res.status(200).json({ file: `public/images/${userId}/${filename}` });
            }
          });
        });
      } else {
        res.status(415).json({ errors: { file: 'The image must be a jpeg or png.' } });
      }
    }
  );
}
// TODO: Make the new photo and photo album uploaded transactional. If one fails, make sure both are deleted.

async function list(req: Request, res: Response, next: NextFunction) {
  // TODO: In photo.controller list function - put a little error handling in here
  // By default get only photos by user
  // If params are for shared, get shared photos
  const { skip = 0, limit = 20 } = req.query;
  const photos = Photo.findPaginated(
    { userId: res.locals.authorizedData.userId },
    { skip: +skip, limit: +limit, sort: '-createdAt' }
  );
  return res.status(200).json(photos);
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
