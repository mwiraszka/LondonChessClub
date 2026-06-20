import { Router } from 'express';

import {
  addImages,
  deleteAlbum,
  deleteImage,
  getAllImagesMetadata,
  getBatchThumbnailImages,
  getMainImage,
  getThumbnailImages,
  updateImages,
} from '../controllers/images.controller';
import { auth } from '../middlewares/auth.index';
import { imageUpload } from '../middlewares/image-upload.middleware';

export const imagesRouter = Router()
  .get('/all-metadata', getAllImagesMetadata)
  .get('/thumbnails', getThumbnailImages)
  .get('/batch-thumbnails', getBatchThumbnailImages)
  .get('/:id', getMainImage)
  .put('/', auth, imageUpload, updateImages)
  .post('/', auth, imageUpload, addImages)
  .delete('/:id', auth, deleteImage)
  .delete('/album/:album', auth, deleteAlbum);
