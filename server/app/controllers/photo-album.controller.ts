import { Request, Response, NextFunction } from 'express';
import PhotoAlbum from '../models/photo-album.model.js';
import Photo from '../models/photo.model.js';
import mongoose from 'mongoose';
import APIError from '../helpers/APIError.js';

function get(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const { skip = 0, limit = 50 } = req.query;
  Promise.all([
    PhotoAlbum.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: '$photos' },
      { $skip: +skip },
      { $limit: +limit },
    ]),
    PhotoAlbum.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: '$photos' },
      { $count: 'photos' },
    ]),
  ])
    .then((data) => {
      res.json({ photos: data[0], totalCount: data[1][0].photos });
    })
    .catch((err) => {
      next(err);
      res.json({ error: 'Something went wrong' });
    });
}

function create(req: Request, res: Response, next: NextFunction) {
  const { name, userId, isPublic } = req.body;
  new PhotoAlbum({ name, userId, isPublic }).save().then((response: any) => {
    res.json(response);
  });
}

function list(req: Request, res: Response, next: NextFunction) {
  const { userId } = res.locals.authorizedData;
  const { isPublic } = req.query;
  if (!isPublic) {
    PhotoAlbum.find({ userId })
      .then((albums: any) => {
        res.json(albums);
      })
      .catch((e: APIError) => next(e));
  } else {
    PhotoAlbum.find({ userId, isPublic })
      .then((albums: any) => {
        res.json(albums);
      })
      .catch((e: APIError) => next(e));
  }
}

function deleteAlbum(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  PhotoAlbum.findByIdAndDelete(id, (error: any, doc: any) => {
    if (error) next(error);
    Photo.deleteOne({ _id: { $in: doc.photos } }, (error: any, _doc: any) => {
      if (error) next(error);
      res.json({ success: true });
    });
  });
}

export default { create, list, deleteAlbum, get };
