import { Router } from 'express';

import {
  addArticle,
  deleteArticle,
  getArticle,
  getArticles,
  updateArticle,
} from '../controllers/articles.controller';
import { auth } from '../middlewares/auth.index';

export const articlesRouter = Router()
  .get('/', getArticles)
  .get('/:id', getArticle)
  .post('/', auth, addArticle)
  .put('/:id', auth, updateArticle)
  .delete('/:id', auth, deleteArticle);
